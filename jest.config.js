const { defaults: tsJestPreset } = require('ts-jest/presets');

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    ...tsJestPreset.transform,
  },
};
