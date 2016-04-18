const path = require('path');
const test = require('ava');
const checks = require('../src/checks');

const files = [path.join(__dirname, './test-package.json')];

test('check', t => {
  checks.check(files, outdated => {
    const project = outdated[0].project;
    const dependency = outdated[0].dependency;
    const version = outdated[0].version;

    if (project === 'npm-update-notifier' &&
        dependency === 'ava' &&
        version !== '^0.11.0') {
      t.pass();
    } else {
      t.fail();
    }
  }, () => ({}));
});
