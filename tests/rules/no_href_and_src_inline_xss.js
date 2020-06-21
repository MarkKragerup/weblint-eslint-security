/**
 * @fileoverview Enforces consistent naming for boolean props
 * @author Mark Kragerup & Mathias Høyrup Nielsen
 */

'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/no_href_and_src_inline_xss');

const fs = require('fs');

const parser = require('../parser').BABEL_ESLINT;

const ruleTester = new RuleTester({
    parser: parser
});

ruleTester.run('no_href_and_src_inline_xss', rule, {
    valid: [
        //valid src
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_src_tests/valid_src_safe_concat_binary.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_src_tests/fixed_src_safe_concat_w_unsafe_binary.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_src_tests/valid_src_safe_latest_reassignment.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_src_tests/valid_src_safe_string_in_variable.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_src_tests/valid_src_template_string_w_safe_var.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_src_tests/valid_src_unsafe_input_gets_escaped.js', 'utf8')
        },
        //valid href
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_href_tests/valid_href_safe_concat_binary.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_href_tests/valid_href_safe_latest_reassignment.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_href_tests/valid_href_safe_string_in_variable.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_href_tests/valid_href_template_string_w_safe_var.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_href_tests/valid_href_unsafe_input_gets_escaped.js', 'utf8')
        },
    ],

    // The fixer function is automatically tested, by match with the specified output file
    invalid: [
        //invalid src attributes
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_src_tests/invalid_src_safe_concat_w_unsafe_binary.js', 'utf8'),
            errors: [{message: "src property value might be XSS vulnerable"}],
            output: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_src_tests/fixed_src_safe_concat_w_unsafe_binary.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_src_tests/invalid_src_template_string_w_user_input.js', 'utf8'),
            errors: [{message: "src property value might be XSS vulnerable"}],
            output: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_src_tests/fixed_src_template_string_w_user_input.js', 'utf8'),
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_src_tests/invalid_src_var_is_user_input.js', 'utf8'),
            errors: [{message: "src property value might be XSS vulnerable"}],
            output: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_src_tests/fixed_src_var_is_user_input.js', 'utf8'),
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_src_tests/invalid_src_var_unsafe_reassign.js', 'utf8'),
            errors: [{message: "src property value might be XSS vulnerable"}],
            output: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_src_tests/fixed_src_var_unsafe_reassign.js', 'utf8')
        },
        //invalid href attributes
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_href_tests/invalid_href_safe_concat_w_unsafe_binary.js', 'utf8'),
            errors: [{message: "href property value might be XSS vulnerable"}],
            output: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_href_tests/fixed_href_safe_concat_w_unsafe_binary.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_href_tests/invalid_href_template_string_w_user_input.js', 'utf8'),
            errors: [{message: "href property value might be XSS vulnerable"}],
            output: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_href_tests/fixed_href_template_string_w_user_input.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_href_tests/invalid_href_var_is_user_input.js', 'utf8'),
            errors: [{message: "href property value might be XSS vulnerable"}],
            output: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_href_tests/fixed_href_var_is_user_input.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_href_tests/invalid_href_var_unsafe_reassign.js', 'utf8'),
            errors: [{message: "href property value might be XSS vulnerable"}],
            output: fs.readFileSync('tests/test-files/no_href_and_src_inline_xss/no_href_tests/fixed_href_var_unsafe_reassign.js', 'utf8')
        },
    ]
});