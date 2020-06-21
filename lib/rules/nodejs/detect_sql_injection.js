/** This rule flags SQL queries which might be vulnerable to SQL injections,
 *  Through the inclusion of variables immediately deemed safe in unescaped query calls. */

// Make use of some helper functions, shared between rules
const {isSafeValue} = require('../../utils/node_safety_check_helper');

module.exports = {
    meta: {
        type: 'warning',
        docs: {
            description: 'Detect the usage of SQL queries that might be vulnerable to SQL Injections.',
            category: 'Possible security vulnerability',
            recommended: true,
        },
        fixable: 'code',
    },
    create: function (context) {

        // The set of known safe variables, at a given point in traversal
        let safeOriginVarsSet = new Set();

        return {
            VariableDeclarator(node) {
                // If a variable is initialized safely, add it to the safe set of variables
                if (isSafeValue(node.init, safeOriginVarsSet)) safeOriginVarsSet.add(node.id.name);
            },
            AssignmentExpression(node) {
                // In case of variable reassignments, update the safe variables set based on the new value
                if (isSafeValue(node.right, safeOriginVarsSet) && !!node.left.name) {
                    safeOriginVarsSet.add(node.left.name);
                } else {
                    safeOriginVarsSet.delete(node.left.name);
                }
            },
            CallExpression(node) {

                // Proceed only for .query function calls
                if (!(!!node.callee.property && node.callee.property.name === 'query')) return;

                // Proceed only for queries not trivially safe
                if(!!node.arguments && isSafeValue(node.arguments[0], safeOriginVarsSet)) return;

                // Provide a suggestion to
                let suggestedFix = `...`;

                context.report({
                    node,
                    message: 'Parameterize the input for the query, to avoid SQL Injection vulnerabilities. See more at: https://www.npmjs.com/package/mysql#escaping-query-values.',
                    suggest: [
                        {
                            desc: `Parameterize the input for the query, to avoid SQL Injection vulnerabilities. See more at: https://www.npmjs.com/package/mysql#escaping-query-values.`,
                            fix: function (fixer) {
                                return fixer.insertTextAfter(node, suggestedFix);
                            },
                        },
                    ],
                });
            },
        };
    },
};
