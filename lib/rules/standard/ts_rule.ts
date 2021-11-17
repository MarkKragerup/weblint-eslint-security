/** Insert Rule Description */
import { Rule } from "eslint";

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
                return context.report({node, message: `${context.getFilename()} property value might be XSS vulnerable`});
            }
        }
    },
};
export default ts_rule;

/*
suggestion: `Avoid using unescaped variables of uncertain origin in href and src property values,
                                   due to the concern that they might originate from user input.
                                   Alternatively (this does not guarantee safety), escape the input, by applying the following call to the value:
                                   " .toLowerCase().replace('javascript:', '/javascript/:/'); "`,
 */