/** Checks if the node is part of the escape call format, we suggest to use.
 *  DISCLAIMER: This escape call can be beaten by clever types of input found in common polyglots. */
const isEscapeCall = (hrefValueNode) => {

    let isScriptEscaped = false;

    // Not all CallExpressions formats are alike. If an access error is thrown, its not an escape call.
    if (hrefValueNode.type === 'CallExpression') {
        try {
            // Validate that the structure is like: (something).toLowerCase().replace('javascript:', '/javascript/:/');
            isScriptEscaped = hrefValueNode.callee.object.callee.property.name === 'toLowerCase';
            isScriptEscaped = isScriptEscaped && hrefValueNode.callee.property.name === 'replace';
            isScriptEscaped = isScriptEscaped && hrefValueNode.arguments[0].value === 'javascript:';
            isScriptEscaped = isScriptEscaped && hrefValueNode.arguments[1].value === '/javascript/:/';
        } catch (error) {
            // An access error has been thrown due to node structure - it is not an escape call
            isScriptEscaped = false;
        }
    }

    return isScriptEscaped;
};

/** Combined recursive safety check - Checks if the node is safe, depending on its type */
const isSafeValue = (valueNode, safeOriginVarsSet) => {

    // This means that the value is null or undefined. This explicitly can't be user input, and is XSS safe
    if (!valueNode) return;

    // Literal strings are considered to be always safe.
    if (valueNode.type === 'Literal' && (typeof valueNode.value === 'string' || typeof valueNode.value === 'number')) return true;

    // Template literals do not escape expressions inside, so each contained expression must be validated
    if (valueNode.type === 'TemplateLiteral') {
        const exps = valueNode.expressions;
        return !!exps && exps.every(exp => isSafeValue(exp, safeOriginVarsSet));
    }

    // Binary expressions are used for string concatenation, and all parts of the expression must be validated
    if (valueNode.type === 'BinaryExpression' && (isSafeValue(valueNode.left, safeOriginVarsSet) && isSafeValue(valueNode.right, safeOriginVarsSet))) return true;

    // If we get here, and its an unsafe identifier, it returns false. Else, it returns true
    return valueNode.type === 'Identifier' && safeOriginVarsSet.has(valueNode.name);
};

module.exports.isSafeValue = isSafeValue;

exports.isSafeOrXSSEscapedValue = (valueNode, safeOriginVarsSet) => {

    // Function calls, that are not escape calls, cannot have guaranteed safe return values
    if (valueNode.type === 'CallExpression' && isEscapeCall(valueNode)) return true;

    return isSafeValue(valueNode, safeOriginVarsSet);
}
