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
                console.log(context.getScope().references[0].resolved?.references);
                context.report({ node, message: node.declarations[0].id.toString() });
            }
        }
    },
};
export default ts_rule;