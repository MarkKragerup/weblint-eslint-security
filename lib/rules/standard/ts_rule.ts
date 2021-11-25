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

const getNodeByVariableName = (identifier: ESTree.Identifier, context: RuleContext): Scope.Variable | undefined => {
    const relevantScope = getScopeForNode(identifier, context);
    return relevantScope?.set.get(identifier.name);
    // return relevantScope?.variables.find(v => v.identifiers.find(i => i.name === identifier.name));
}

const getScopeForNode = (node: ESTree.Node, context: RuleContext): Scope.Scope | null => context.getSourceCode().scopeManager.acquire(node);


/**
 * Thought 1: The callee of the function trace can provide a verify function with any subnode type.
 * This presents a problem in which you need to know when to call verify. The type is not enough,
 * as it could potentially be an unpacked object.
 *
 * Thought 2:
 */
const traceValue = (node: ESTree.Node, context: RuleContext, verify: (node: ESTree.Node) => boolean): boolean => {
    // This is not correct - Figure out when to call verify
    if (node.type === "Literal") return verify(node);

    else if (node.type === "Identifier") {
        getNodeByVariableName(node, context);
    }

    else if (node.type === "CallExpression") {
        if (isRequireCall(node)) {
            // Assumption that the file is .js
            // Some path logic manipulation thingy has to be done
            const fileContents = readFileSync("tests/test-files/ts_rule" + getRequirePath(node).replace(".", "") + '.js', 'utf-8');
            console.log('contents of file', fileContents);

            // Creating AST on the Linter class instance
            const linter = new Linter();
            linter.verify(fileContents, { rules: { semi: 2 } });

            const sourceCode = linter.getSourceCode();
            console.log('ast', linter.getSourceCode());

            // The result of the require has an exports.default
            if (sourceCode.lines.find(l => l.includes("exports.default"))) {
                const exportDefaultNode = getExportDefaultNode(sourceCode);

                // The code line export.defaults = 11 is an Identifier node when doing getExportDefaultNode(sourceCode).
                // The 'exports' part of the line is the Identifier.
                if (exportDefaultNode.type !== "Identifier") return false;
                const memberExpression = (exportDefaultNode as ESTree.Identifier & { parent: ESTree.MemberExpression }).parent;
                const assignmentExpression = (memberExpression as ESTree.MemberExpression & { parent: ESTree.AssignmentExpression }).parent;
                const declarationValue = (assignmentExpression as ESTree.AssignmentExpression).right;

                if (declarationValue.type !== "Identifier" && declarationValue.type !== 'Literal') return false;
                if (declarationValue.type === "Literal") verify(declarationValue);
                else if (declarationValue.type === "Identifier") return traceValue(declarationValue, context, verify); // Does this work?
            } else { // The result is an object of values
                // Check all values
                return true;
            }
        }

        // If the callee type is Identifier - it is a function
        else if (node.callee.type === "Identifier") {
            const functionName = node.callee.name;
            const functionArgs = node.arguments;
        }
    }

    else if (node.type === "ObjectExpression") {
        // const a = { name: "Jens", age: 12 }
        return true;
    }

    else if (node.type === "MemberExpression") {
        // const a = require('./context).a;
        if (isMemberExprRequireCall(node)) {
            return true;
        } else { // Array.from(new Map(["google", "https://google.com"]));
            return true;
        }
    }

    else if (node.type === "ArrayExpression") {
        // const a = [1,2,3]
        return true;
    }

    else if (node.type === "NewExpression") {
        // const a = new - type of expression (classes, Map etc.)
        return true;
    }

    return true;
}

const isRequireCall = (node: ESTree.CallExpression) => ((node.callee as ESTree.Identifier).name === 'require');

const isMemberExprRequireCall = (node: ESTree.MemberExpression) => (((node.object as ESTree.CallExpression).callee as ESTree.Identifier).name === 'require');

// You can only provide nodes that are require calls - the parameter of the require call and therefore return type of this function is string.
const getRequirePath = (node: ESTree.CallExpression): string => (node.arguments[0] as ESTree.Literal).value as string;

const getExportDefaultNode = (sourceCode: SourceCode): ESTree.Node => {
    const lineIndex = sourceCode.lines.findIndex(l => l.includes("exports.default"));
    const rangeIndex = (sourceCode as SourceCode & { lineStartIndices: number[] }).lineStartIndices[lineIndex];
    return (sourceCode.getNodeByRangeIndex(rangeIndex) as ESTree.VariableDeclaration);
}