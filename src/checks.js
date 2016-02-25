'use strict';

const latestVersion = require('latest-version');

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
 * @param  {Function} notify      notify-function
 * @param  {Function} callback    callback which should be executed after it finishes
 * @return {void}
 */
function check(files, notify, callback) {
  console.log('----------------------------');
  console.log('- check for npm updates... -');
  console.log('----------------------------');

  files.forEach(packageFile => {
    clearRequireCache(packageFile);

    const pkg = require(packageFile);
    const promises = checkForPackage(pkg);

    Promise.all(promises).then(values => {
      const outdated = values.filter(promise => {
        return promise !== null;
      });

      notify(pkg.name, outdated);
      callback();
    });
  });
}

/**
 * loops the check-function with the given interval
 *
 * @param  {Object}    files     typed in files to be checked
 * @param  {Function}  notify    notify-function
 * @param  {String}    interval  time-delay in ms
 * @return {void}
 */
function checkWithInterval(files, notify, interval) {
  check(files, notify, () => {
    setTimeout(() => {
      checkWithInterval(files, notify, interval);
    }, interval);
  });
}

module.exports = {
  check,
  checkWithInterval
};
