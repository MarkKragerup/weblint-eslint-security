/** Insert Rule Description */
import { Rule, Scope } from "eslint";
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
                scanFileForAllRequires(context, node);
            },
            CallExpression: node => {
                scanNodeForRequire(context, node);
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