/**
 * @fileoverview Testing of the rule 'detect_missing_helmet' for detecting
 * incorrect use of ExpressJS applications without the use of Helmet.js defaults.
 * @author Mark Kragerup & Mathias Høyrup Nielsen
 */

'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/nodejs/detect_missing_helmet');

const fs = require('fs');

const parser = require('../parser').BABEL_ESLINT;

const ruleTester = new RuleTester({
    parser: parser,
});

ruleTester.run('detect_missing_helmet', rule, {

    valid: [
        {
            code: fs.readFileSync('tests/test-files/detect_missing_helmet/valid_helmet_import_and_apply.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/detect_missing_helmet/valid_helmet_import_and_apply_different_name.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/detect_missing_helmet/fixed_helmet_only_import_no_apply.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/detect_missing_helmet/fixed_no_helmet_but_expectCt.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/detect_missing_helmet/fixed_no_helmet_nor_expectCt.js', 'utf8')
        }
    ],

    invalid: [
        {
            code: fs.readFileSync('tests/test-files/detect_missing_helmet/invalid_helmet_only_import_no_apply.js', 'utf8'),
            errors: [{message: "Use the Helmet.js module for enhanced security on HTTP response headers in your Express application. \
                                  Also consider using the expectCt flag: https://helmetjs.github.io/docs/expect-ct/"}],
            output: fs.readFileSync('tests/test-files/detect_missing_helmet/fixed_helmet_only_import_no_apply.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/detect_missing_helmet/invalid_no_helmet_but_expectCT.js', 'utf8'),
            errors: [{message: "Use the Helmet.js module for enhanced security on HTTP response headers in your Express application. \
                                  Also consider using the expectCt flag: https://helmetjs.github.io/docs/expect-ct/"}],
            output: fs.readFileSync('tests/test-files/detect_missing_helmet/fixed_no_helmet_but_expectCT.js', 'utf8')

        },
        {
            code: fs.readFileSync('tests/test-files/detect_missing_helmet/invalid_no_helmet_nor_expectCT.js', 'utf8'),
            errors: [{message: "Use the Helmet.js module for enhanced security on HTTP response headers in your Express application. \
                                  Also consider using the expectCt flag: https://helmetjs.github.io/docs/expect-ct/"}],
            output: fs.readFileSync('tests/test-files/detect_missing_helmet/fixed_no_helmet_nor_expectCT.js', 'utf8'),
        },
    ]
});
