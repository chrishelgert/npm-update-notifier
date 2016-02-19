#!/usr/bin/env node
'use strict';

const meow = require('meow');
const latestVersion = require('latest-version');
const notifier = require('node-notifier');
const updateNotifier = require('update-notifier');

const nunPackage = require('./package.json');

updateNotifier({pkg: nunPackage}).notify({defer: false});

/**
 * notify message for one dependency via node-notifier
 *
 * @param  {String} name of the project
 * @param  {String} dependency outdated dependency
 * @param  {String} newVersion available version
 * @return {void}
 */
function notifyDependency(project, dependency, newVersion) {
  notifier.notify({
    title: `NPM update notifier`,
    message: `Please update ${dependency} to ${newVersion}`,
    sound: true,
    wait: true
  });
}

/**
 * notify message for project when more dependencies
 * are out of date via node-notifier
 *
 * @param  {String} project  name of the project
 * @param  {Number} amount   how much dependencies are out of date
 * @return {void}
 */
function notifyDependencies(project, amount) {
  notifier.notify({
    title: `NPM update notifier`,
    message: `${project}: ${amount} dependencies are out of date`,
    sound: true,
    wait: true
  });
}

/**
 * cleares the require-cache for the given filename
 *
 * @param  {String} filename name of the file that should be
 *                  removed from cache
 * @return {void}
 */
function clearRequireCache(filename) {
  delete require.cache[require.resolve(filename)];
}

/**
 * search for a new version of the dependency
 *
 * @param  {String}  dependency     dependency to be checked
 * @param  {String}  currentVersion currentVersion from pom
 * @return {Object}  Promise        Pomise
 */
function checkForUpdate(dependency, currentVersion) {
  return new Promise(resolve => {
    latestVersion(dependency).then(version => {
      if (currentVersion === version) {
        resolve(null);
      } else {
        resolve({dependency, version});
      }
    });
  });
}

/**
 * checks dependencies for a package-file and give the promises back
 *
 * @param  {Object} pgk Content from a package.json-file
 * @return {Array}      Promises-array
 */
function checkForPackage(pkg) {
  const promises = [];

  for (const prop in pkg.dependencies) {
    if (pkg.dependencies[prop] !== '*') {
      promises.push(checkForUpdate(prop, pkg.dependencies[prop].replace('^', '')));
    }
  }

  for (const prop in pkg.devDependencies) {
    if (pkg.devDependencies[prop] !== '*') {
      promises.push(checkForUpdate(prop, pkg.devDependencies[prop].replace('^', '')));
    }
  }

  for (const prop in pkg.peerDependencies) {
    if (pkg.peerDependencies[prop] !== '*') {
      promises.push(checkForUpdate(prop, pkg.peerDependencies[prop].replace('^', '')));
    }
  }

  return promises;
}

/**
 * checks for each input-file the dependencies (normal, dev and peer)
 * and notifies on updates
 *
 * @param  {Object}   files       user-input-object from meow
 * @param  {Boolean}  useConsole  output only in console or with node-notifier
 * @param  {Function} callback    callback which should be executed after it finishes
 * @return {void}
 */
function check(files, useConsole, callback) {
  console.log('----------------------------');
  console.log('- check for npm updates... -');
  console.log('----------------------------');

  files.forEach(el => {
    clearRequireCache(el);

    const pkg = require(el);
    const promises = checkForPackage(pkg);

    Promise.all(promises).then(values => {
      const outdated = values.filter(promise => {
        return promise !== null;
      });

      if (useConsole) {
        outdated.forEach(out => {
          console.log(`${pkg.name}: New version ${out.version} for ` +
            `dependency '${out.dependency}'`);
        });

        return callback();
      }

      if (outdated.length > 1) {
        // notify more dependencies are out of date for file ...
        notifyDependencies(pkg.name, outdated.length);
      } else if (outdated.length === 1) {
        // notify the only dependency that is out of date
        notifyDependency(pkg.name, outdated[0].dependency, outdated[0].version);
      }

      callback();
    });
  });
}

/**
 * loops the check-function with the given interval
 * @param  {Object}  files       typed in files to be checked
 * @param  {String}  interval    time-delay in ms
 * @param  {Boolean} useConsole  output only in console or with node-notifier
 * @return {void}
 */
function checkWithInterval(files, interval, useConsole) {
  check(files, useConsole, () => {
    setTimeout(() => {
      checkWithInterval(files, interval, useConsole);
    }, interval);
  });
}

// initial meow and write the --help
const cli = meow(`
  Usage
    $ nun <package-file>
  Options
    --interval, interval for checking updates
    --console, output only in console
  Example
    nun ./package.json
`);

const flags = cli.flags;
const input = cli.input.filter(file => {
  return file.indexOf('package.json') !== -1;
});

// no package-file typed in
if (!input.length) {
  console.error('package.json file required');
  process.exit(1);
}

let interval = flags.interval;
const useConsole = flags.console;

// should be called with interval or not
if (interval) {
  interval = (typeof interval === 'number') ? interval : 1000 * 60 * 60;
  checkWithInterval(input, interval, useConsole);
} else {
  check(input, useConsole, () => ({}));
}
