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
        }
    ],

    invalid: [
        {
            code: fs.readFileSync('tests/test-files/ts_rule/trace_test.js', 'utf8'),
            errors: [{ message: 'Errormsg' }]
        }
    ],
});