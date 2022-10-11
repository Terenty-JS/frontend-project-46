#!/usr/bin/env node

import { Command } from 'commander';
import gendiff from '../../index.js';


const program = new Command();

program
.version('0.0.1', '-V, --version', 'output the version number')
.description('Compares two configuration files and shows a difference.')
.option('-f, --format <type>', 'output format')
.argument('<filepath1>')
.argument('<filepath2>')
.action((filepath1, filepath2) => {
    console.log(gendiff(filepath1, filepath2));
});

program.parse();
