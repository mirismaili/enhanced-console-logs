/**
 * Created on 1401/6/15 (2022/9/6).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import {relative} from 'node:path'
import {fileURLToPath} from 'node:url'

['debug', 'info', 'log', 'warn', 'error', 'assert'].forEach((methodName) => {
  console[methodName] = EnhancedMethod(methodName)
})

/**
 * @see https://stackoverflow.com/a/60305881/5318303
 */
function EnhancedMethod (methodName) {
  const originalLoggingMethod = console[methodName]
  return function enhancedMethod () {
    const originalPrepareStackTrace = Error.prepareStackTrace
    Error.prepareStackTrace = (_, stack) => stack
    const callee = new Error().stack[1]
    Error.prepareStackTrace = originalPrepareStackTrace
    const fileUrl = callee.getFileName()
    const filePath = fileUrl.startsWith('file:///') ? relative(process.cwd(), fileURLToPath(fileUrl)) : fileUrl
    const logLocation = `${filePath}:${callee.getLineNumber()}`
    originalLoggingMethod.call(this, ...arguments, `\n\tat ${logLocation}\n`)
  }
}
