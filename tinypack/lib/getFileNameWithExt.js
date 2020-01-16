const path = require('path');

/**
 * If fileName didn't contain an extension, append config.fileExt to it
 *
 * @param {*} fileName
 */
function getFileNameWithExt(fileName, fileExt = 'js') {
  const fileExtention = path.extname(fileName) ? "" : `.${fileExt}`;

  return `${fileName}${fileExtention}`;
}

module.exports = getFileNameWithExt;
