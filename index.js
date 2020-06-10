/** This package contributes new ESLint security rules for standard (.html, regular .js) file types */

const no_href_and_src_inline_xss = require('./lib/rules/no_href_and_src_inline_xss.js')

module.exports = {
    rules: {
        "no-href-and-src-inline-xss": no_href_and_src_inline_xss,
    }
}