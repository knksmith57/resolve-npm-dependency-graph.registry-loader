'use strict'

let isLoaded = false
const commands = Object.create(null)
const npm = _import('npm')
const { promisify } = require('util')

npm.loadAsync = promisify(npm.load.bind(npm))

const exp = {
  /** @type {boolean} */
  get loaded() {
    return isLoaded
  },

  get npm() {
    return npm
  },

  /**
   * Must be called before any npm commands are accessed
   *
   * @returns {Promise}
   */
  async load() {
    if (!isLoaded) {
      await npm.loadAsync()
      configureCommands()
      isLoaded = true
    }
    return npm
  }
}

module.exports = new Proxy(exp, {
  /**
   * Enable dynamic lookups on `npm` commands
   * @returns {*}
   */
  get(obj, prop) {
    return prop in exp
      ? exp[prop]
      : prop in commands
        ? commands[prop]
        : undefined
  },
  set() {}
})

Object.defineProperty(exp, 'loaded', { enumerable: true })
Object.defineProperty(exp, 'npm', { enumerable: true })

/**
 * `require()` with global fallback support
 *
 * @param {string} pkgName
 * @returns {*}
 */
function _import(pkgName) {
  try {
    return require(pkgName)
  } catch (e) {
    const importGlobal = require('import-global')
    return importGlobal(pkgName)
  }
}

/**
 * Configures `npm` command accessors
 */
function configureCommands() {
  Object.keys(npm.commands).forEach(name => {
    const fn = promisify(npm.commands[name].bind(npm))
    Object.defineProperty(fn, 'name', { value: name })
    commands[name] = fn
  })
}
