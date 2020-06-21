/**
 * @fileoverview Testing of the rule 'detect_sql_injection' for detecting possible SQL injection vulnerabilities.
 * @author Mark Kragerup & Mathias Høyrup Nielsen
 */

'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/nodejs/detect_sql_injection');

const fs = require('fs');

const parser = require('../parser').BABEL_ESLINT;

const ruleTester = new RuleTester({
    parser: parser,
});

ruleTester.run('detect_sql_injection', rule, {

    valid: [
        {
            code: fs.readFileSync('tests/test-files/detect_sql_injection/valid_explicit_string.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/detect_sql_injection/valid_safe_variables.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/detect_sql_injection/valid_safe_variables_template_string.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/detect_sql_injection/valid_safe_parameterized_statemen.js', 'utf8')
        }
    ],

    invalid: [
        {
            code: fs.readFileSync('tests/test-files/detect_sql_injection/invalid_unsafe_template_string.js', 'utf8'),
            errors: [{message: "Use the Helmet.js module for enhanced security on HTTP response headers in your Express application. \
                                  Also consider using the expectCt flag: https://helmetjs.github.io/docs/expect-ct/"}]
        },
        {
            code: fs.readFileSync('tests/test-files/detect_sql_injection/invalid_unsafe_user_input.js', 'utf8'),
            errors: [{message: "Use the Helmet.js module for enhanced security on HTTP response headers in your Express application. \
                                  Also consider using the expectCt flag: https://helmetjs.github.io/docs/expect-ct/"}]
        }
    ]
});