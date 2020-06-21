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
            code: fs.readFileSync('tests/test-files/detect_sql_injection/valid_explicit_string.js', 'utf8'),
        },
        {
            code: fs.readFileSync('tests/test-files/detect_sql_injection/valid_safe_variables.js', 'utf8'),
        },
        {
            code: fs.readFileSync('tests/test-files/detect_sql_injection/valid_safe_variables_template_string.js', 'utf8'),
        },
        {
            code: fs.readFileSync('tests/test-files/detect_sql_injection/valid_safe_parameterized_statement.js', 'utf8'),
        },
    ],

    invalid: [
        {
            code: fs.readFileSync('tests/test-files/detect_sql_injection/invalid_unsafe_template_string.js', 'utf8'),
            errors: [{message: 'Parameterize the input for the query, to avoid SQL Injection vulnerabilities. See more at: https://www.npmjs.com/package/mysql#escaping-query-values.'}],
        },
        {
            code: fs.readFileSync('tests/test-files/detect_sql_injection/invalid_unsafe_user_input.js', 'utf8'),
            errors: [{message: 'Parameterize the input for the query, to avoid SQL Injection vulnerabilities. See more at: https://www.npmjs.com/package/mysql#escaping-query-values.'}],
        },
    ],
});
