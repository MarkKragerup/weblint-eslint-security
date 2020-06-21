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
                    message: 'Use the Helmet.js module for enhanced security on HTTP response headers in your Express application. \
                                  Also consider using the expectCt flag: https://helmetjs.github.io/docs/expect-ct/',
                    suggest: [
                        {
                            desc: `Use the Helmet.js library defaults to harden your application against misconfigured HTTP response headers.
                                   One way to apply this is by calling the "helmet()" default middleware function, in an app ".use()" call.`,
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
