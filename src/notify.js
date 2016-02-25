'use strict';

const notifier = require('node-notifier');

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
    message: `${project}: please update ${dependency} to ${newVersion}`,
    sound: true,
    wait: true
  });
}

/**
 * notify message for more outdated dependencies in one project
 *
 * @param  {String} project name of the project
 * @param  {String} amount  amount of outdated dependencies
 * @return {void}
 */
function notifyDependencyAmount(project, amount) {
  notifier.notify({
    title: `NPM update notifier`,
    message: `${project}: ${amount} dependencies are out of date`,
    sound: true,
    wait: true
  });
}

/**
 * handle notify for outdated dependencies
 *
 * @param  {String}  name of the project with outdated dependencies
 * @param  {Array}   dependencies array of outdated dependencies
 * @return {void}
 */
function notifyDependencies(project, dependencies) {
  if (dependencies.length === 1) {
    notifyDependency(project,
                     dependencies[0].dependency,
                     dependencies[0].version);
  } else if (dependencies.length > 1) {
    notifyDependencyAmount(project,
                           dependencies.length);
  }
}

/**
 * logs message for outdated dependency on the console
 *
 * @param  {String} project    project with outdated dependencies
 * @param  {String} dependency outdated dependency
 * @param  {String} newVersion available Version
 * @return {void}
 */
function notifyDependencyOnConsole(project, dependency, newVersion) {
  console.log(`${project}: New version ${newVersion} for ` +
    `dependency '${dependency}'`);
}

/**
 * logs message for outdated dependencies on the console
 *
 * @param  {String}  name of the project with outdated dependencies
 * @param  {Array}   dependencies array of outdated dependencies
 * @return {void}
 */
function notifyDependenciesOnConsole(project, dependencies) {
  dependencies.forEach(dep => {
    notifyDependencyOnConsole(project, dep.dependency, dep.version);
  });
}

module.exports = {
  notifyDependencies,
  notifyDependenciesOnConsole
};
