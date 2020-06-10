/**
 * @fileoverview Enforces consistent naming for boolean props
 * @author Mark Kragerup & Mathias Høyrup Nielsen
 */

'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/no_href_and_src_inline_xss');

/* Set parsers somewhere - either in parserOptions or options of the rule test */

const ruleTester = new RuleTester();

/*ruleTester.run('no_href_and_src_inline_xss', rule, {
    valid: [{
        code: `a.href = "google.com"`
    },
    ],

    invalid: [{
        code: `a.href = userInput`,
        errors: [{message: "Don't fuck shit up!"}]
    }]
});*/