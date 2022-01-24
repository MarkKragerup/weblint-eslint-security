# eslint-plugin-weblint-security
[![npm version](https://img.shields.io/npm/v/eslint-plugin-weblint-security.svg)](https://www.npmjs.com/package/eslint-plugin-weblint-security)
[![Downloads/month](https://img.shields.io/npm/dm/eslint-plugin-weblint-security.svg)](http://www.npmtrends.com/eslint-plugin-weblint-security)

Additional ESLint security rules for JavaScript, React and Node.js / Express!

## 💿 Installation
Install ESLint either locally or globally. (Note that locally, per project, is strongly preferred)

```
$ npm install --save-dev eslint eslint-plugin-weblint-security
```

- Requires Node.js `>=14.4.0`
- Requires ESLint `>=7.2.0`
- Requires ES-Parser `>=2020`

## 🔧 Setup & Usage
Include Weblint security plugin in your **.eslintrc.json** configuration file ("env" required*):
```
{
    "env": {
        "browser": true,
        "es2020": true
    },
    "plugins": [
        "weblint-security"
    ].
    "extends": [
        "eslint:recommended",
        "plugin:weblint-security/recommended"
    ]
}
```

### React support
For **React** projects, include the **React specific** rules and configurations:
````
{
    "env": {
        "browser": true,
        "es2020": true
    },
    "parserOptions": {
        "sourceType": "module"
    },
    "parser": "babel-eslint",
    "plugins": [
        "weblint-security"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:weblint-security/recommended",
        "plugin:weblint-security/react"
    ]
}
````

### Node.js support (including Express.js security aspects)
For **Node.js** projects, include the **Node.js specific** rules and configurations:
```
{
    "env": {
        "node": true
    },
    "parser": "babel-eslint",
    "plugins": [
        "weblint-security"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:weblint-security/recommended",
        "plugin:weblint-security/nodejs"
    ]
}
```

## 📖 Rules
✒️ - the mark of fixable rules. Use `eslint --fix .` to apply all available fixes to your project.

### Recommended base rules (@/recommended)

| **Rule ID** | **Description** |    |
|:--------|:------------|:--:|
| [no-href-and-src-inline-xss](https://github.com/MarkKragerup/weblint-eslint-security/blob/master/docs/rules/no_href_and_src_inline_xss.md) | Disallows unescaped variables of uncertain <br/> origin from href and src attributes, due to the <br/>concern that they might originate from user input. | ✒️ |

### React specific rules (@/react)

| **Rule ID** | **Description** |    |
|:--------|:------------|:--:|
| [no-href-and-src-inline-xss-react](https://github.com/MarkKragerup/weblint-eslint-security/blob/master/docs/rules/no_href_and_src_inline_xss_react.md) | Disallows unescaped variables of uncertain <br/> origin from href and src JSX attributes, due to the <br/>concern that they might originate from user input. | ✒️ |

### Node.js specific rules (@/nodejs)

| **Rule ID** | **Description** |    |
|:--------|:------------|:--:|
| [detect-sql-injection](https://github.com/MarkKragerup/weblint-eslint-security/blob/master/docs/rules/detect_sql_injection.md) | Detect the usage of SQL queries that might be </br>vulnerable to SQL Injections. |  |
| [detect-missing-helmet](https://github.com/MarkKragerup/weblint-eslint-security/blob/master/docs/rules/detect_missing_helmet.md) | Disallow use of ExpressJS applications without <br/>the use of Helmet.js defaults, due to the concern that </br>the HTTP headers might be insecurely configured. | ✒️ |

## ❤️ Contributions
We welcome contributions!

Please use GitHub's Issues/PRs.

Please make sure any contributions are covered within the tests, or that new tests are supplied for the contribution.

### Testing the rules

To run the tests, use: `npm test`

Test coverage is achieved through the set of **test files**, located at: <br/>`/tests/test-files/<relevant rule-name>/`

**All test files are prefixed** with one of the following:

- `valid_` for files that should give no output. Useful for testing false positives and soundness.

- `invalid_` for files that should give some output. Useful for testing use-cases and completeness.

- `fixed_` for files that contain the output of applying `eslint --fix` to some `invalid_` file. 
