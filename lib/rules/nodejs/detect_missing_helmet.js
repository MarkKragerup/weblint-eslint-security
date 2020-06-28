/** This rule flags expressJS apps without the use of Helmet.js defaults,
 *  due to the concern that the HTTP headers might be vulnerable. */

module.exports = {
    meta: {
        type: 'warning',
        docs: {
            description: 'Disallow use of ExpressJS applications without the \
                          use of Helmet.js defaults, due to the concern that the HTTP headers might be insecurely configured',
            category: 'Possible security vulnerability',
            recommended: true,
            suggest: 'Use the Helmet.js library defaults to harden your application against misconfigured HTTP response headers. One way to apply this is by calling the "helmet()" default middleware function, in an app ".use()" call.',
            url: 'https://github.com/MarkKragerup/weblint-eslint-security/blob/master/docs/rules/detect_missing_helmet.md',
        },
        fixable: 'code',
    },
    create: function (context) {

        /** Set of flags and identifier objects for determining and referencing
         ** the use of the Express library, the Helmet library and the Helmet recommended functions. */
        let isUsingExpress = false;
        let expressIdentifier = null;

        let isUsingHelmet = false;
        let helmetIdentifier = null;

        let isUsingHelmetDefaults = false;

        return {
            VariableDeclarator(node) {
                // Proceed only if the variable declaration is a "require" statement
                if (!(node.init.type === 'CallExpression' && node.init.callee.name === 'require')) return;

                // Checks if the required module (the last argument) is express or helmet
                const [argument] = node.init.arguments.slice(-1);

                // When express, set the name of the express import identifier
                if (!!argument && argument.value === 'express') {
                    isUsingExpress = true;
                    expressIdentifier = node.id.name;
                }

                // When helmet, set the name of the helmet import identifier
                if (!!argument && argument.value === 'helmet') {
                    isUsingHelmet = true;
                    helmetIdentifier = node.id.name;
                }
            },
            CallExpression(node) {

                // Proceed only for .listen function calls, which launches the express app (always the final line of code)
                const isListenCall = !!node.callee.property && node.callee.property.name === 'listen';

                // When launching Express applications without safe Helmet.js defaults, report a warning
                if (isUsingExpress && isListenCall && (!isUsingHelmet || !isUsingHelmetDefaults)) {

                    // Provide a simple suggestion of configuring Helmet.js defaults
                    let suggestedFix = `${expressIdentifier}.use(${helmetIdentifier}());\n`;

                    // If Helmet.js is not used, suggest both import and correct configurations
                    if (!isUsingHelmet) {
                        suggestedFix = `const helmet = require('helmet');\n${expressIdentifier}.use(helmet());\n`;
                    }
                    
                    context.report({
                        node,
                        message: 'Use the Helmet.js module for enhanced security on HTTP response headers in your Express application. \
                                  Also consider using the expectCt flag: https://helmetjs.github.io/docs/expect-ct/',
                        fix(fixer) {
                            return fixer.insertTextBefore(node, suggestedFix);
                        },
                    });
                }

                // Listen calls were handled above. Validate middleware call to Helmet.js defaults
                if (!isUsingExpress || !isUsingHelmet) return;

                // Check if it is a .use call on the Express application
                const isUseCall = !!node.callee.property && node.callee.property.name === 'use' && node.callee.object.name === expressIdentifier;

                // Check that the argument of the .use call, is a middleware function call
                const [argument] = node.arguments.slice(-1);
                const isMiddlewareFunction = !!argument && isUseCall && argument.type === 'CallExpression';

                // Validates that the middleware is the helmet default call
                if (isMiddlewareFunction && argument.callee.name === helmetIdentifier && argument.arguments.length === 0) {
                    isUsingHelmetDefaults = true;
                }
            },
        };
    },
};
