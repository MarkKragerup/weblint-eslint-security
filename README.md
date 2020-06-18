# ESLint-plugin-Weblint-Security
## ESLint security extension for basic Javascript

### Installation
Install ESLint either locally or globally. (Note that locally, per project, is strongly preferred)

```
npm install eslint --save
```

If you installed ESLint globally, you have to install this Weblint plugin globally too. Otherwise, install it locally.

```
npm install weblint-eslint-security --save
```

### Configuration
Include Weblint security plugin in your ESLint configuration file

```
"extends": [
  "eslint:recommended",
  "plugin:weblint-security/recommended"
]
```

Include it also in the plugins section:
```
"plugins": [ 'weblint-security' ]
```

### Testing

### Fixing
List of rules that supports autofix with `eslint --fix .`: <br/>
[no_href_and_src_inline_xss](https://github.com/MarkKragerup/weblint-eslint-security/blob/master/docs/rules/no_href_and_src_inline_xss.md)

### List of supported rules
[no_href_and_src_inline_xss](https://github.com/MarkKragerup/weblint-eslint-security/blob/master/docs/rules/no_href_and_src_inline_xss.md)

