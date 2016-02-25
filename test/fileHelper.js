const test = require('ava');
const path = require('path');
const fileHelper = require('../src/fileHelper');

const isWindows = /^win/.test(process.platform);

const files = [
  './abc.js',
  '../package.json'
];

const windowsFile = 'C:/Workspace/Project';
const unixFile = '/Volumes/Workspace/Project';

if (isWindows) {
  files.push(windowsFile);
} else {
  files.push(unixFile);
}

test('filterPackageFiles', t => {
  const result = fileHelper.filterPackageFiles(files);
  const expected = ['../package.json'];
  t.same(expected, result);
});

test('resolvePaths', t => {
  const result = fileHelper.resolvePaths(files);
  const expected = [
    path.join(process.cwd(), './abc.js'),
    path.join(process.cwd(), '../package.json')
  ];

  if (isWindows) {
    expected.push(windowsFile);
  } else {
    expected.push(unixFile);
  }

  t.same(expected, result);
});
