const resolveFrom = require('resolve-from')
const path = require('path')
const fs = require('fs')

const jestPath = require.resolve('jest')
const jestCliPath = resolveFrom(jestPath, 'jest-cli')
const jestUtilPath = resolveFrom(jestCliPath, 'jest-util')
const patchFilePath = path.resolve(
  path.dirname(jestUtilPath),
  'installCommonGlobals.js',
)
const lines = fs.readFileSync(patchFilePath, 'utf-8').split('\n')

// This is required for NAPI client tests
lines[78] = '  globalObject.process = process'

const result = lines.join('\n')

fs.writeFileSync(patchFilePath, result)

console.log(`Jest "process" patched applied to ${patchFilePath}`)
