# eslint-plugin-weblint-security
[![npm version](https://img.shields.io/npm/v/eslint-plugin-weblint-security.svg)](https://www.npmjs.com/package/eslint-plugin-weblint-security)
[![Downloads/month](https://img.shields.io/npm/dm/eslint-plugin-weblint-security.svg)](http://www.npmtrends.com/eslint-plugin-weblint-security)

Additional ESLint security rules for Javascript

## 💿 Installation
Install ESLint either locally or globally. (Note that locally, per project, is strongly preferred)

```
$ npm install --save-dev eslint eslint-plugin-weblint-security
```

- Requires Node.js `>=14.4.0`
- Requires ESLint `>=7.2.0`
- Requires ES-Parser `>=2020`

## 🔧 Setup & Usage
Include Weblint security plugin in your **.eslintrc.json** configuration file:
```
{
    "env": {
        "browser": true,
        "es2020": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:weblint-security/recommended"
    ],
    "plugins": [
        "weblint-security"
    ]
}
```

## 📖 Rules
✒️ - the mark of fixable rules. Use `eslint --fix .` to apply all available fixes to your project.

[no_href_and_src_inline_xss](https://github.com/MarkKragerup/weblint-eslint-security/blob/master/docs/rules/no_href_and_src_inline_xss.md)

| Rule ID | Description |    |
|:--------|:------------|:--:|
| [node/no-href-and-src-inline-xss](https://github.com/MarkKragerup/weblint-eslint-security/blob/master/docs/rules/no_href_and_src_inline_xss.md) | Disallows unescaped variables of uncertain <br/> origin from href and src attributes, due to the <br/>concern that they might originate from user input. | ✒️ |

## ❤️ Contributions
We welcome contributions!

Please use GitHub's Issues/PRs.

Please make sure any contributions are covered within the tests, or that new tests are supplied for the contribution.

### Testing the rules

To run the tests, use: `npm test`

Test coverage is achieved through the set of test files, located at: `/tests/test-files/<relevant rule-name>/`

All test files are prefixed with one of the following:

- `valid_` for files that should give no output. Useful for testing false positives and soundness.

- `invalid_` for files that should give some output. Useful for testing use-cases and completeness.

- `fixed_` for files that contain the output of applying `eslint --fix` to some `invalid_` file. 