# `resolve-npm-dependency-graph.registry-loader`

> pure npm client loader for [resolve-npm-dependency-graph]

## Usage

```js
const Resolver = require('resolve-npm-dependency-graph')
const RegistryLoader = require('resolve-npm-dependency-graph.registry-loader')

const loader = RegistryLoader.createLoader()
const client = new Resolver.Client({ packageMetadataLoader: loader })

// load the dependency graph of fastify
;(async () => {
  const npmPkg = await client.load('fastify@latest')
})()
```

[resolve-npm-dependency-graph]: https://npm.im/resolve-npm-dependency-graph
