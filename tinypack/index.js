const path = require("path");

const { createGraphPure } = require("./createGraph");
const bundle = require("./bundle");
const config = require("../tinypack.config");

const graph = createGraphPure(config.entry);
bundle(
  graph,
  config.entry,
  path.join(config.output.path, config.output.filename)
);
