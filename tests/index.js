'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const plugin = require('..');

const ruleFiles = fs.readdirSync(path.resolve(__dirname, '../lib/rules/'))
    .map((f) => path.basename(f, '.js'));

