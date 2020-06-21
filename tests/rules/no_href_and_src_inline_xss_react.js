/**
 * @fileoverview Enforces consistent naming for boolean props
 * @author Mark Kragerup & Mathias Høyrup Nielsen
 */

'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/no_href_and_src_inline_xss_react');

const fs = require('fs');

const parser = require('../parser').BABEL_ESLINT;

console.log(parser);

const ruleTester = new RuleTester({
    parser: parser,
});

ruleTester.run('no_href_and_src_inline_xss-react', rule, {
    valid: [
        //valid src
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss_react/src/valid_src_safe_binary.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss_react/src/valid_src_safe_template_string.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss_react/src/valid_src_unsafe_input_gets_reassigned.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss_react/src/valid_src_unsafe_value_gets_escaped.js', 'utf8')
        },
        //valid href
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss_react/href/valid_href_safe_binary.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss_react/href/valid_href_safe_template_string.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss_react/href/valid_href_unsafe_input_gets_reassigned.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss_react/href/valid_href_unsafe_value_gets_escaped.js', 'utf8')
        },
    ],

    invalid: [
        //invalid src
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss_react/src/invalid_src_safe_state_unsafe_reassignment.js', 'utf8'),
            errors: [{message: "src property value might be XSS vulnerable"}]
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss_react/src/invalid_src_state_is_user_data.js', 'utf8'),
            errors: [{message: "src property value might be XSS vulnerable"}]
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss_react/src/invalid_src_unsafe_reassignment.js', 'utf8'),
            errors: [{message: "src property value might be XSS vulnerable"}]
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss_react/src/invalid_src_unsafe_template_string.js', 'utf8'),
            errors: [{message: "src property value might be XSS vulnerable"}]
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss_react/src/invalid_src_unsafe_value_in_binary.js', 'utf8'),
            errors: [{message: "src property value might be XSS vulnerable"}]
        },
        //invalid href
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss_react/href/invalid_href_safe_state_unsafe_reassignment.js', 'utf8'),
            errors: [{message: "href property value might be XSS vulnerable"}]
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss_react/href/invalid_href_state_is_user_data.js', 'utf8'),
            errors: [{message: "href property value might be XSS vulnerable"}]
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss_react/href/invalid_href_unsafe_reassignment.js', 'utf8'),
            errors: [{message: "href property value might be XSS vulnerable"}]
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss_react/href/invalid_href_unsafe_template_string.js', 'utf8'),
            errors: [{message: "href property value might be XSS vulnerable"}]
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss_react/href/invalid_href_unsafe_value_in_binary.js', 'utf8'),
            errors: [{message: "href property value might be XSS vulnerable"}]
        },
    ]
});