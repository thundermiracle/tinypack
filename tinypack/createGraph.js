const path = require("path");

const getFileNameWithExt = require("./lib/getFileNameWithExt");
const createAssets = require('./createAssets');

/**
 * prevent call createAssets if the same file was included to speedup transpile speed
 * 
 * @param {*} entryFile 
 * @param {*} depsGraph : Dont use this parameter
 */
function createGraphQuick(entryFile, depsGraph = {}) {
  // attach file extension if not defined
  const fileFullPath = getFileNameWithExt(entryFile);
  if (depsGraph[fileFullPath]) {
    return depsGraph;
  }

  const assets = createAssets(fileFullPath);
  depsGraph[fileFullPath] = assets;

  const entryFileBasePath = path.dirname(entryFile);
  Object.keys(assets.dependencies).forEach(fRelativePath => {
    createGraphQuick(
      path.join(entryFileBasePath, getFileNameWithExt(fRelativePath)),
      depsGraph
    );
  });

  return depsGraph;
}

/**
 * the later import will win
 * @param {*} entryFile 
 */
function createGraphPure(entryFile) {
  let depsGraph = {};

  const fileFullPath = getFileNameWithExt(entryFile);

  const assets = createAssets(fileFullPath);
  depsGraph[fileFullPath] = assets;

  const entryFileBasePath = path.dirname(entryFile);
  Object.keys(assets.dependencies).forEach(fRelativePath => {
    const childFileFullPath = path.join(
      entryFileBasePath,
      getFileNameWithExt(fRelativePath)
    );

    const childGraph = createGraphPure(childFileFullPath);

    // override parent dependency if filename is the same
    depsGraph = { ...depsGraph, ...childGraph };
  });

  return depsGraph;
}

module.exports = {
  createGraphPure,
  createGraphQuick,
}