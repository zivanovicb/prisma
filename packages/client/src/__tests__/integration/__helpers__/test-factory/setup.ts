import glob from 'glob'
import path from 'path'

type LifeCycle = [
  fn: Parameters<typeof afterAll>[0],
  timeout?: Parameters<typeof afterAll>[1],
]

type Options = {
  folders?: string[]
  afterAll?: LifeCycle
  afterEach?: LifeCycle
  beforeAll?: LifeCycle
  beforeEach?: LifeCycle
}

function setup(root: string, opt: Options = {}) {
  // search for the test suites that we are going to execute
  const folderGlobs = opt.folders ? `{${opt.folders.join(',')}}` : '*'
  const testSuiteGlobs = `/${folderGlobs}/*.suite.{j,t}s`
  const testSuitePaths = glob.sync(path.join(root, testSuiteGlobs))

  // we prepare to extract the test suite info out of its path
  const testSuiteRegexStr = `^${escapeRegex(root)}\/(.*?)\/(.*?).suite.(j|t)s$`
  const testSuiteNameRegex = new RegExp(testSuiteRegexStr)

  for (const testSuitePath of testSuitePaths) {
    // for each test suite found, extract it's name and folder
    const testSuiteInfo = testSuiteNameRegex.exec(testSuitePath)
    const testSuiteFolder = testSuiteInfo ? testSuiteInfo[1] : '<no-folder>'
    const testSuiteName = testSuiteInfo ? testSuiteInfo[2] : '<no-name>'
    const testSuiteDesc = `${testSuiteName} (${testSuiteFolder})`

    // register the default life-cycle methods if they exist
    opt.afterAll ? afterAll(...opt.afterAll) : void 0
    opt.afterEach ? afterEach(...opt.afterEach) : void 0
    opt.beforeAll ? beforeAll(...opt.beforeAll) : void 0
    opt.beforeEach ? beforeEach(...opt.beforeEach) : void 0

    // execute the tests suite files inside of the describe
    describe(testSuiteDesc, () => void require(testSuitePath))
  }
}

function escapeRegex(string: string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}

export { setup }
