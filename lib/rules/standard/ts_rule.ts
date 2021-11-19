/** Insert Rule Description */
import { Rule, Scope } from "eslint";
import ESTree from 'estree';

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
                // Get all source code scopes.
                const scopes: Scope.Scope[] = context.getSourceCode().scopeManager.scopes;

                // An array of scopes which contains a Map (a Set) from variable name to variable data.
                const scopesVariableSet: Map<string, Scope.Variable>[] = scopes.map((e) => e.set);

                // Filter on reference array being set.
                const references: Map<string, Scope.Variable>[] = scopesVariableSet.map(scope => filterOnReferences(scope));
                if (isAllScopesEmpty(references)) return;

                // Access variable references.
                const variableReferences: Map<string, Scope.Reference>[] = references.map(scope => getReferences(scope));

                // Filter on the Reference Node having a writeExpr.
                const filteredWriteExpr: Map<string, Scope.Reference>[] = variableReferences.map((scope) => filterOnWriteExpr(scope));

                // Access writeExpr.
                const writeExpressions = filteredWriteExpr.map(scope => accessWriteExpr(scope));

                // Filter on the writeExpr being a CallExpression and its callee name being require.
                const requireCalls = writeExpressions.map((scope) => isRequireCalls(scope));
                if (isAllScopesEmpty(requireCalls)) return;

                // Access require paths
                const requirePaths = requireCalls.map(scope => getRequirePaths(scope));

                console.log(requirePaths);
                context.report({ node, message: 'The program contains a require call' });
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