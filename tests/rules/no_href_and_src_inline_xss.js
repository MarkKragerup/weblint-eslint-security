/**
 * @fileoverview Enforces consistent naming for boolean props
 * @author Mark Kragerup & Mathias Høyrup Nielsen
 */

'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/no_href_and_src_inline_xss');

const fs = require('fs');

const parser = require('../parser').BABEL_ESLINT;

console.log(parser);

const ruleTester = new RuleTester({
    parser: parser,
});

ruleTester.run('no_href_and_src_inline_xss', rule, {
    valid: [{
        code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/valid_safe_concat_binary.js', 'utf8')
    },
    ],

    invalid: [{
        code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/invalid_var_is_user_input.html', 'utf8'),
        errors: [{message: "Don't fuck shit up!"}]
    }]
});