'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/standard/ts_rule');

const fs = require('fs');

const parser = require('../parser').BABEL_ESLINT;

const ruleTester = new RuleTester({
    parser: parser,
});

ruleTester.run('typescript rule test', rule, {
    valid: [
        {
            code: fs.readFileSync('tests/test-files/ts_rule_test', 'utf8')
        },
    ],
});