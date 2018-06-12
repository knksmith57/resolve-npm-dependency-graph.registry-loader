'use strict'

const npm = require('./npm')

/** @returns {function(string): Promise} */
exports.createLoader = () => {
  /** @param {string} spec */
  async function resolve(spec) {
    await npm.load()
    const response = await npm.view([spec], true)
    return unwrapRegistryResponse(spec, response)
  }

  return resolve
}

/**
 * @param {string} spec
 * @param {object} response
 * @throws
 * @returns {object}
 */
function unwrapRegistryResponse(spec, response) {
  const versions = Object.keys(response)
  if (versions.length === 0) {
    throw new Error(`Impossible to satisfy the version dependency '${spec}'`)
  }
  return response[versions.pop()]
}
