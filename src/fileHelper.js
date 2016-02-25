'use strict';

const path = require('path');
const fs = require('fs');

/**
 * checks if the given file exists
 *
 * @param  {String} file
 * @return {Boolean}
 */
function exists(file) {
  try {
    return fs.statSync(file).isFile();
  } catch (Exception) {
    return false;
  }
}

/**
 * checks if the file is a package.json - file
 *
 * @param  {String}  file
 * @return {Boolean}
 */
function isPackage(file) {
  return file.indexOf('package.json') !== -1;
}

/**
 * Check if the path is absolute or relative
 * resolve relative path´s with the current directory
 *
 * @param  {String} file input path
 * @return {String}      resolved Path
 */
function resolvePath(file) {
  return path.isAbsolute(file) ? file : path.join(process.cwd(), file);
}

/**
 * filter package-files and returns only existing packages-files
 *
 * @param  {Array} files  all input-files
 * @return {Array}        filtered package-files
 */
function filterPackageFiles(files) {
  return files.filter(file => exists(file) && isPackage(file));
}

/**
 * Check if the paths are absolute or relative
 * resolve relative path´s with the current directory
 *
 * @param  {Array} files unresolved paths
 * @return {Array}       resolved paths
 */
function resolvePaths(files) {
  return files.map(file => resolvePath(file));
}

module.exports = {
  filterPackageFiles,
  resolvePaths
};
