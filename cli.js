#!/usr/bin/env node
'use strict';

const meow = require('meow');
const updateNotifier = require('update-notifier');

const fileHelper = require('./src/fileHelper');
const notify = require('./src/notify');
const checks = require('./src/checks');
const nunPackage = require('./package.json');
updateNotifier({pkg: nunPackage}).notify({defer: false});

// initial meow and write the --help
const cli = meow(`
  Usage
    $ nun <package-file>
  Options
    --interval, interval for checking updates
    --console, output only in console
  Example
    nun ./package.json
    nun /Volumes/project/package.json
    nun ./project1/package.json ./project2/package.json
`);

const flags = cli.flags;
const files = fileHelper.resolvePaths(
  fileHelper.filterPackageFiles(cli.input)
);

// no package-file typed in
if (!files.length) {
  console.error('package.json file required');
  process.exit(1);
}

let interval = flags.interval;
const notifyDependencies = flags.console ? notify.notifyDependenciesOnConsole : notify.notifyDependencies;

// should be called with interval or not
if (interval) {
  interval = (typeof interval === 'number') ? interval : 1000 * 60 * 60;
  checks.checkWithInterval(files, notifyDependencies, interval);
} else {
  checks.check(files, notifyDependencies, () => ({}));
}
