const writeFileSyncRecursive = require("./lib/writeFileSyncRecursive");

/**
 * use IIFE to bundle js files
 * @param {*} depsGraph 
 * @param {*} entryFile 
 */
function graphToStr(depsGraph, entryFile) {
  return `
;(function(graph) {
  function require(moduleId) {
    function localRequire(relativePath) {
      return require(graph[moduleId].dependencies[relativePath]);
    }

    const exports = {};
    ;(function(require, exports, code) {
      eval(code);
    })(localRequire, exports, graph[moduleId].code);

    return exports;
  }

  require('${entryFile}');
})(${JSON.stringify(depsGraph)});
  `;
}

function bundle(depsGraph, entryFile, outputFile) {
  const contentsForBundle = graphToStr(depsGraph, entryFile);

  writeFileSyncRecursive(outputFile, contentsForBundle);
}

module.exports = bundle;
