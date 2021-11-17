import { RuleTester } from "eslint";

import ts_rule from '../../lib/rules/standard/ts_rule';

import fs from 'fs';

import BABEL_ESLINT from '../parser';

const ruleTester = new RuleTester({
    parser: BABEL_ESLINT,
});

ruleTester.run('typescript rule test', ts_rule, {
    valid: [
        {
            code: fs.readFileSync('tests/test-files/valid_ts_rule_test.js', 'utf8')
        },
    ],

    invalid: [
        {
            code: fs.readFileSync('tests/test-files/ts_rule_test.js', 'utf8'),
            errors: [{message: 'Always use let'}]
        },
    ],
});