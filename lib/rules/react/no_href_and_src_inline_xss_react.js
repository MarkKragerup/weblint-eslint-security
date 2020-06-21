/** This rule flags the use of unsafe strings in href or src property values,
 *  due to the concern that it might have originated from user input.
 *  It is compatible with React.js 16+ state systems. */

// Make use of some helper functions, shared between rules
const {isSafeOrXSSEscapedValue} = require('../../utils/node_safety_check_helper');

module.exports = {
    meta: {
        type: 'error',
        docs: {
            description: 'Disallows unescaped variables of uncertain origin in href and src property values, \
                          due to the concern that they might originate from user input.',
            category: 'Possible security vulnerability',
            recommended: true,
        },
        fixable: 'code',
    },
    create: function (context) {

        // Maps for keeping track of React.js special states
        let stateMap = new Map();

        // The set of known safe variables, at a given point in traversal
        let safeOriginVarsSet = new Set();

        return {
            VariableDeclarator(node) {
                // If a variable is initialized safely, add it to the safe set of variables
                if (isSafeOrXSSEscapedValue(node.init, safeOriginVarsSet)) safeOriginVarsSet.add(node.id.name);

                // Update state map in case of state initialisation, eg: [ get.., set..] = useState()
                if (!!node.init.callee && node.init.callee.name === 'useState') {

                    // When states are initialized, set the mapping from setter to getter
                    const getter = node.id.elements[0].name;

                    // ReactJS allows setters to be omitted, like: [getStuff, ] = useState(null);
                    const setter = !!node.id.elements[1] && node.id.elements[1].name ? node.id.elements[1].name : '';

                    stateMap.set(setter, getter);

                    // Update the safe variables set by the getter based on the safety of the value
                    const initialValue = node.init.arguments[0];
                    if (isSafeOrXSSEscapedValue(initialValue, safeOriginVarsSet)) {
                        safeOriginVarsSet.add(getter);
                    } else {
                        safeOriginVarsSet.delete(getter);
                    }
                }
            },
            CallExpression(node) {
                // Call expression may be a call to state setter, warranting a state map update

                // If the setter is not in the state map, this is not a state-reassignment
                if (!stateMap.has(node.callee.name)) return;

                // Extract variable name and value from state setter function call
                let getterName = stateMap.get(node.callee.name);
                let newValue = node.arguments[0];

                // Update safe variable set based on the new value of the states getter
                if (isSafeOrXSSEscapedValue(newValue, safeOriginVarsSet)) {
                    safeOriginVarsSet.add(getterName);
                } else {
                    safeOriginVarsSet.delete(getterName);
                }
            },
            AssignmentExpression(node) {
                // When reassigning regular variables, adjust the set of safe values based on the new values safety
                if (isSafeOrXSSEscapedValue(node.right, safeOriginVarsSet)) {
                    safeOriginVarsSet.add(node.left.name);
                } else {
                    safeOriginVarsSet.delete(node.left.name);
                }
            },
            JSXIdentifier(node) {
                const propertyName = node.name;
                if (propertyName !== 'href' && propertyName !== 'src') return; // Only consider href and src properties

                if (node.parent.value.type !== 'JSXExpressionContainer') return; // Only consider JSX expressions (eg {} in render )

                // Extract the node containing the property value node
                const propertyValueNode = node.parent.value.expression;
                if (isSafeOrXSSEscapedValue(propertyValueNode, safeOriginVarsSet)) return; // Property value is safe - return

                // Suggest to the user, that the right-hand side of the href assignment be escaped
                const propertyValueSourceCode = context.getSourceCode().getText(propertyValueNode);
                const suggestedFix = `.${propertyName} = (${propertyValueSourceCode}).toLowerCase().replace('javascript:', '/javascript/:/');`;

                context.report({
                    node,
                    message: `${propertyName} property value might be XSS vulnerable`,
                    suggest: [
                        {
                            desc: `Avoid using unescaped variables of uncertain origin in href and src property values, \
                                   due to the concern that they might originate from user input. \
                                   Alternatively (this does not guarantee safety), escape the input, by applying the following call to the value: \                                   
                                   " .toLowerCase().replace('javascript:', '/javascript/:/'); "`,
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