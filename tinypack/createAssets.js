const fs = require("fs");
const path = require('path');
const babelParser = require("@babel/parser");
const { transformFromAstSync } = require("@babel/core");
const { default: traverse } = require("@babel/traverse");

const getFileNameWithExt = require('./lib/getFileNameWithExt');

/**
 * Get file's code and dependencies
 *
 * @param {*string} fileName: absolute path of file
 */
function createAssets(fileFullPath) {
  // Get file contents
  const fileContent = fs.readFileSync(fileFullPath, { encoding: "utf8" });

  // Get ast
  const ast = babelParser.parse(fileContent, { sourceType: "module" });

  // code
  const { code } = transformFromAstSync(ast, null, { presets: ["@babel/env"] });

  /*
   dependencies object
   { relativePath: RealRelativePathFrom tinypack }
  */
  const dirname = path.dirname(fileFullPath);
  const dependencies = {};
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      const depFullPath = path.join(dirname, node.source.value);
      dependencies[node.source.value] = getFileNameWithExt(depFullPath);
    }
  });

  return {
    code,
    dependencies
  };
}

module.exports = createAssets;
