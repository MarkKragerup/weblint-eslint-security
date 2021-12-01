/** Insert Rule Description */
import { readFileSync } from 'fs';
import {Rule, Scope, Linter, SourceCode} from "eslint";
import ESTree from 'estree';
import RuleContext = Rule.RuleContext;

const ts_rule: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallows unescaped variables of uncertain origin from href and src attributes, due to the concern that they might originate from user input.',
            category: 'Possible security vulnerability',
            recommended: true,
            url: "https://github.com/MarkKragerup/weblint-eslint-security/blob/master/docs/rules/no_href_and_src_inline_xss.md"
        },
        fixable: 'code',
    },
    create: function (context) {
        return {
            VariableDeclaration: node => {
                if (node.declarations[0].init?.type !== "Literal") {

                    const declarationValue = node.declarations[0].init;
                    if (!declarationValue) return;

                    const result  = traceValue(declarationValue, context, (node) => node.type === "Literal");

                    if (result) {
                        context.report({node, message: "Errormsg"});
                    }
                }

                // The variable declaration value is a literal
                else {
                    return;
                }

            }
        }
    },
};
export default ts_rule;

const filterOnReferences = (map: Map<string, Scope.Variable>) => new Map(Array.from(map).filter(([k,v]) => v.references?.[0]));
const getReferences = (map: Map<string, Scope.Variable>) => new Map(Array.from(map).map(([k,v]) => [k, v.references[0]]));
const filterOnWriteExpr = (map: Map<string, Scope.Reference>) => new Map(Array.from(map).filter(([k,v]) => v.writeExpr));
const accessWriteExpr = (map: Map<string, Scope.Reference>): Map<string, ESTree.CallExpression> => new Map(Array.from(map).map(([k,v]) => [k, v.writeExpr as ESTree.CallExpression]));
const isRequireCalls = (map: Map<string, ESTree.CallExpression>) => new Map(Array.from(map).filter(([k,v]) => v.type === "CallExpression" && v.callee.type === "Identifier" && v.callee?.name === "require"));
const getRequirePaths = (map: Map<string, ESTree.CallExpression>) => new Map(Array.from(map).map(([k, v]) => [k, v.arguments[0].type === "Literal" ? v.arguments[0].value : undefined]));
const isAllScopesEmpty = (scopes: Map<string, any>[]) => scopes.every((scope) => scope.size === 0);

const scanFileForAllRequires = (context: RuleContext, node: ESTree.VariableDeclaration) => {
    // Get all source code scopes.
    const scopes: Scope.Scope[] = context.getSourceCode().scopeManager.scopes;

    // Access the set of variables for each scope.
    const scopesVariableSet: Map<string, Scope.Variable>[] = scopes.map((e) => e.set);

    // Filter out variables if reference array is not set.
    const references: Map<string, Scope.Variable>[] = scopesVariableSet.map(scope => filterOnReferences(scope));
    if (isAllScopesEmpty(references)) return;

    // Access variable references.
    const variableReferences: Map<string, Scope.Reference>[] = references.map(scope => getReferences(scope));

    // Filter out Reference nodes if they do not contain a writeExpr.
    const filteredWriteExpr: Map<string, Scope.Reference>[] = variableReferences.map((scope) => filterOnWriteExpr(scope));

    // Access writeExpr.
    const writeExpressions = filteredWriteExpr.map(scope => accessWriteExpr(scope));

    // Filter out variables where writeExpr is not a CallExpression and its callee name not being require.
    const requireCalls = writeExpressions.map((scope) => isRequireCalls(scope));
    if (isAllScopesEmpty(requireCalls)) return;

    // Access require paths
    const requirePaths = requireCalls.map(scope => getRequirePaths(scope));

    console.log(requirePaths);
    context.report({ node, message: 'The program contains a require call' });
}

const isCallExpression = (node: ESTree.CallExpression | ESTree.VariableDeclaration): node is ESTree.CallExpression => {
    return (node as ESTree.CallExpression).callee !== undefined;
}

// TODO: Should be renamed to isSafeRequire and implement check for if require call is safe.
const scanNodeForRequire = (context: RuleContext, node: ESTree.CallExpression | ESTree.VariableDeclaration) => {
    let requirePath;

    if (isCallExpression(node)) {
        if ((node.callee as ESTree.Identifier).name !== 'require') return;

        requirePath = (node.arguments[0] as ESTree.Literal).value ?? '';
    } else {
        // Follow the call
        if (node.declarations[0].init?.type === "CallExpression") {
            const call = node.declarations[0].init as ESTree.CallExpression;

            if ((call.callee as ESTree.Identifier).name !== 'require') return;

            requirePath = (call.arguments[0] as ESTree.Literal).value ?? '';
        }
        // Follow potential TemplateLiteral variables
        else if (node.declarations[0].init?.type === "TemplateLiteral") return;

        else return;
    }

    console.log(requirePath);
    context.report({ node, message: 'The node contains a require call' });
}

type IValidVariableNode = ESTree.VariableDeclaration | ESTree.CallExpression;

// Assumption - identifier nodes does always get declared in the same file.
const getDeclarationValueForIdentifier = (identifier: ESTree.Identifier, srcCode: SourceCode): ESTree.Expression | undefined => {
    const scopeVariable = srcCode.scopeManager.scopes.find(s => s.set.has(identifier.name))?.set.get(identifier.name);
    if (!scopeVariable) return undefined;

    const variableDeclarator = (scopeVariable.identifiers[0] as ESTree.Identifier & { parent: ESTree.VariableDeclarator}).parent;
    const declarationValue = variableDeclarator.init;

    if (!declarationValue) return undefined;
    else return declarationValue;
}

const getNodeByIdentifierNode = (identifier: ESTree.Identifier, srcCode: SourceCode): Scope.Variable | undefined => {
    const relevantScope = getScopeForNode(identifier, srcCode);
    return relevantScope?.set.get(identifier.name);
    // return relevantScope?.variables.find(v => v.identifiers.find(i => i.name === identifier.name));
}

const getScopeForNode = (node: ESTree.Node, srcCode: SourceCode): Scope.Scope | null => srcCode.scopeManager.acquire(node);


/**
 * Thought 1: The callee of the function trace can provide a verify function with any subnode type.
 * This presents a problem in which you need to know when to call verify. The type is not enough,
 * as it could potentially be an unpacked object.
 *
 * Thought 2:
 */
const traceValue = (node: ESTree.Node, context: RuleContext, verify: (node: ESTree.Node) => boolean): boolean => {
    // This is not always correct (the type of verify function could be (node: { myValueNode: ObjectExpression }) => boolean).
    if (node.type === "Literal") return verify(node);

    else if (node.type === "Identifier") {
        const declarationValue = getDeclarationValueForIdentifier(node, context.getSourceCode());
        if (!declarationValue) return false;
        return traceValue(declarationValue, context, verify);
    }

    // const a = 1+1;
    else if (node.type === "BinaryExpression") {
        const leftResult = traceValue(node.left, context, verify);
        const right = traceValue(node.left, context, verify);

        // If either is false - return false
        return leftResult && right;
    }

    // const b = `${a}son`;
    else if (node.type === "TemplateLiteral") {
        // Assumption: Only identifiers can be vulnerable
        const identifiers = node.expressions.filter(n => n.type === "Identifier") as ESTree.Identifier[];

        // Get all values for all identifiers
        const identifierValues = identifiers.map((i) => getDeclarationValueForIdentifier(i, context.getSourceCode()));

        // Verify all values
        const results = identifierValues.map(v => v && traceValue(v, context, verify));

        // If one of them is false return false.
        return !results.includes(false);
    }

    // const b = a < 10 ? 'hej' : 'hejsa';
    else if (node.type === "ConditionalExpression") {
        const condition = node.test;
        const ifTrueValue = node.consequent;
        const ifFalseValue = node.alternate;
        return true;
    }

    else if (node.type === "CallExpression") {
        if (isRequireCall(node)) {

            const sourceCode = getSourceCodeByRequireNode(node);

            console.log('here', sourceCode);

            // The result of the require has an exports.default
            if (sourceCode.lines.find(l => l.includes("exports.default"))) {
                const exportDefaultNode = getExportDefaultNode(sourceCode); // Returns an Identifier Node

                // The 'exports' part of the line is the Identifier.
                if (exportDefaultNode.type !== "Identifier") return false;

                // Access .parent.parent.right
                const memberExpression = (exportDefaultNode as ESTree.Identifier & { parent: ESTree.MemberExpression }).parent;
                const assignmentExpression = (memberExpression as ESTree.MemberExpression & { parent: ESTree.AssignmentExpression }).parent;
                const declarationValue = (assignmentExpression as ESTree.AssignmentExpression).right;

                console.log('decl', declarationValue);
                // Does calling traceValue like this work when its from another code file?
                if (declarationValue.type === "Literal" || declarationValue.type === "Identifier") return traceValue(declarationValue, context, verify);
                // Assumption - the exported value can only be an identifier, literal or object.
                else {
                    const results = (declarationValue as ESTree.ObjectExpression).properties.map(p => {
                        if (p.type === "Property") {
                            console.log('p1', p);
                            return traceValue(declarationValue, context, verify);
                        }
                        else { // SpreadElement
                            console.log('p2', p);
                            const identifier = p.argument as ESTree.Identifier;

                            // Get value of identifier (it is an object)
                            const declarationValue = getDeclarationValueForIdentifier(identifier, sourceCode);
                            if (!declarationValue) return false;
                            return traceValue(declarationValue, context, verify); // Call traceValue on the referenced object.
                        }
                    });
                    // If one of them is false return false
                    return !(results.includes(false));
                }
            } else { // Assumption: When you do require('./context') and the file does not have exports.default - you get all the exported values.
                // Create array of all exported values and call traceValue on each value.
                const exportLineIndices = sourceCode.lines.reduce((acc: number[], ele, index) => ele.includes("exports") ? [...acc, index] : acc, []);
                const rangeIndices = exportLineIndices.map((exportLineIndex) => (sourceCode as SourceCode & { lineStartIndices: number[] }).lineStartIndices[exportLineIndex]);
                const exportNodes = rangeIndices.map((rangeIndex) => (sourceCode.getNodeByRangeIndex(rangeIndex)));
                // Access .parent .right
                const valueNodes = exportNodes.map((n) => ((n as ESTree.Identifier & { parent: ESTree.AssignmentExpression}).parent as ESTree.AssignmentExpression).right);
                const results = valueNodes.map((value) => traceValue(value, context, verify));

                // If one of them is false return false.
                return !(results.includes(false));
            }
        }
        // If the callee type is Identifier - it is a function
        else if (node.callee.type === "Identifier") {
            const functionName = node.callee.name;
            const functionArgs = node.arguments;
        }

        else if (node.callee.type === "MemberExpression") { // Array.from(new Map(["google", "https://google.com"]));
            const argument = node.arguments[0];
            if (argument.type === "NewExpression" && (argument.callee as ESTree.Identifier).name === "Map") return traceValue(argument, context, verify);
            else return true;
        }
    }

    else if (node.type === "MemberExpression") {
        // const a = require('./context).a;
        if (isMemberExprRequireCall(node)) {
            // Get the accessed variable
            const variable = node.property as ESTree.Identifier;

            const callExprNode = node.object as ESTree.CallExpression;
            const sourceCode = getSourceCodeByRequireNode(callExprNode);

            const declarationValue = getDeclarationValueForIdentifier(variable, sourceCode);
            if (!declarationValue) return false;

            return traceValue(declarationValue, context, verify);
        } else {
            return true;
        }
    }

    // const a = { url: 'https://google.com' }
    else if (node.type === "ObjectExpression") {
        const results = node.properties.map(p => {
            if (p.type === "Property") return traceValue(p.value, context, verify);
            else { // SpreadElement
                const identifier = p.argument as ESTree.Identifier;

                // Get value of identifier (it is an object)
                const declarationValue = getDeclarationValueForIdentifier(identifier, context.getSourceCode());
                if (!declarationValue) return false;
                return traceValue(declarationValue, context, verify); // Call traceValue on the referenced object
            }
        });
        // If one of them is false return false
        return !(results.includes(false));
    }

    // const a = [1,2,3]
    else if (node.type === "ArrayExpression") {
        const results = node.elements.map((e) => {
            if (!e) return true; // null is safe.
            if (e.type === "Literal") return traceValue(e, context, verify);
            else if (e.type === "SpreadElement") {
                const identifier = e.argument as ESTree.Identifier;

                // Get value of identifier (it is an array)
                const declarationValue = getDeclarationValueForIdentifier(identifier, context.getSourceCode());
                if (!declarationValue) return false;
                return traceValue(declarationValue, context, verify); // Call traceValue on the referenced array.
            } else return true;
        });
        // If one of them is false return false
        return !(results.includes(false));
    }

    // const a = (s: string) => s + "son";
    else if (node.type === "ArrowFunctionExpression") {
        const args = node.params;
        if (node.body.type === "CallExpression") return traceValue(node, context, verify);
        else return true;
    }

    // function a(s: string){ return s + "son" }
    // Remember this is also a method in a class
    else if (node.type === "FunctionDeclaration") {
        const args = node.params;

        // Body is array of statements
        const results = node.body.body.map((statement) => {
            if (statement.type === "ReturnStatement") {
                if (!statement.argument) return true; // null or undefined is safe.
                if (statement.argument.type === "CallExpression") return traceValue(statement.argument, context, verify);
                else return true;
            } else return true;
        });
        // If one of them is false return false
        return !(results.includes(false));
    }

    // const a = new - type of expression (classes, Map etc.)
    else if (node.type === "NewExpression") {
        if (node.callee.type === "Identifier" && node.callee.name === "Map") {
            // Assumption: You can only provide 1 argument to a new Map call and the argument is always array of arrays.
            const args = node.arguments[0] as ESTree.ArrayExpression;
            const results = args.elements.map((e) => {
                if (!e) return true; // null is safe
                if (e.type === "ArrayExpression") {
                    if (!e.elements[1]) return true // null is safe.
                    // e.elements is array of key-value pair - check value
                    return traceValue(e.elements[1], context, verify);
                }
                else if (e.type === "SpreadElement") {
                    const identifier = e.argument as ESTree.Identifier;

                    // Get value of identifier (it is an array)
                    const declarationValue = getDeclarationValueForIdentifier(identifier, context.getSourceCode());
                    if (!declarationValue) return false;
                    return traceValue(declarationValue, context, verify); // Call traceValue on the referenced array.
                } else return true;
            });
            return results.includes(false);
        } else { // new class instantiation
            if (node.callee.type === "Identifier") {
                const classIdentifier = node.callee as ESTree.Identifier;
                const sourceCode = context.getSourceCode();

                // Line indices for all class declarations
                const lineIndices = sourceCode.lines.reduce((acc: number[], ele, index) => ele.includes("class") ? [...acc, index] : acc, []);
                const rangeIndices = lineIndices.map((lineIndex) => (sourceCode as SourceCode & { lineStartIndices: number[] }).lineStartIndices[lineIndex]);
                const classNodes = rangeIndices.map((rangeIndex) => sourceCode.getNodeByRangeIndex(rangeIndex)) as ESTree.ClassDeclaration[];

                // Find the correct class.
                const classNode = classNodes.find((c) => c.id && c.id.name === classIdentifier.name);

                // The class is not declared in the same file as it is instantiated.
                if (!classNode) return false;

                // Call traceValue on the ClassDeclaration Node
                return traceValue(classNode, context, verify);
            } else return false;
        }
    }

    else if (node.type === "ClassDeclaration") {
        const classBody = node.body.body;
        const properties = classBody.filter((ele) => ele.type === "PropertyDefinition");
        const methods = classBody.filter((ele) => ele.type === "MethodDefinition");

        // Verify all default values on all properties
        const propertyResults = properties.map((p) => p.value && traceValue(p.value, context, verify));

        // Verify all methods
        const methodResults = methods.map(m => m.value && traceValue(m.value, context, verify));

        // If a property or a method is unsafe return false.
        return !(propertyResults.includes(false) || methodResults.includes(false));
    }

    return true;
}

const isRequireCall = (node: ESTree.CallExpression) => ((node.callee as ESTree.Identifier).name === 'require');

const isMemberExprRequireCall = (node: ESTree.MemberExpression) => (((node.object as ESTree.CallExpression).callee as ESTree.Identifier).name === 'require');

const getExportDefaultNode = (sourceCode: SourceCode): ESTree.Node => {
    const lineIndex = sourceCode.lines.findIndex(l => l.includes("exports.default"));
    const rangeIndex = (sourceCode as SourceCode & { lineStartIndices: number[] }).lineStartIndices[lineIndex];
    return (sourceCode.getNodeByRangeIndex(rangeIndex) as ESTree.VariableDeclaration);
}

// You can only provide nodes that are require calls - the parameter of the require call and therefore return type of this function is string.
const getRequirePath = (node: ESTree.CallExpression): string => (node.arguments[0] as ESTree.Literal).value as string;

const getSourceCodeByRequireNode = (node: ESTree.CallExpression, configObject?: Linter.Config): SourceCode => {
    // Assumption that the file is .js
    // Some path logic manipulation thingy has to be done
    const fileContents = readFileSync("tests/test-files/ts_rule" + getRequirePath(node).replace(".", "") + '.js', 'utf-8');

    // Creating AST on the Linter class instance
    const linter = new Linter();
    linter.verify(fileContents, configObject ?? { rules: { semi: 2 } });

    return linter.getSourceCode();
}
