import { RuleTester } from "eslint";

import ts_rule from '../../lib/rules/standard/ts_rule';

import fs from 'fs';

import BABEL_ESLINT from '../parser';

const ruleTester = new RuleTester({
    parser: BABEL_ESLINT,
    env: { es6: true }
});

ruleTester.run('typescript rule test', ts_rule, {
    valid: [
        {
            code: fs.readFileSync('tests/test-files/ts_rule/valid_string.js', 'utf8'),
        },
        {
            code: fs.readFileSync('tests/test-files/ts_rule/valid_fetch.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/ts_rule/valid_function.js', 'utf8')
        },
        {
            code: fs.readFileSync('tests/test-files/ts_rule/valid_loop.js', 'utf8')
        }
    ],

    invalid: [
        {
            code: fs.readFileSync('tests/test-files/ts_rule/invalid_normal_require.js', 'utf8'),
            errors: [{message: 'The program contains a require call'}]
        },
        {
            code: fs.readFileSync('tests/test-files/ts_rule/invalid_require_in_function.js', 'utf8'),
            errors: [{message: 'The program contains a require call'}]
        },
        {
            code: fs.readFileSync('tests/test-files/ts_rule/invalid_class.js', 'utf8'),
            errors: [{message: 'The program contains a require call'}]
        },
        {
            code: fs.readFileSync('tests/test-files/ts_rule/invalid_loop.js', 'utf8'),
            errors: [{message: 'The program contains a require call'}, {message: 'The program contains a require call'}, {message: 'The program contains a require call'}]
        },
    ],
});