process.env.PRISMA_HIDE_PREVIEW_FLAG_WARNINGS = 'true'

// NAPI PR introduced a Jest hack on "process", see src/packages/client/helpers/patchJest.js
// which outputs many logs in tests like
// (node:80676) MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
// 13 exit listeners added to [process]. Use emitter.setMaxListeners() to increase limit
// (Use `node --trace-warnings ...` to show where the warning was created)
// https://github.com/prisma/prisma/pull/6016
//
// This make them disappear
process.setMaxListeners(200)
