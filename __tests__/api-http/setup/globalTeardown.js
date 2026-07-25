import { execSync } from 'node:child_process'
import fs from 'node:fs'
import { SERVER_INFO_PATH } from './globalSetup.js'

function killTree(pid) {
  if (process.platform === 'win32') {
    try {
      execSync(`taskkill /pid ${pid} /T /F`, { stdio: 'ignore' })
    } catch {
      // Already exited.
    }
  } else {
    try {
      process.kill(-pid, 'SIGTERM')
    } catch {
      // Already exited.
    }
  }
}

export default async function globalTeardown() {
  const child = globalThis.__XRI_TEST_SERVER__
  if (child?.pid) killTree(child.pid)

  if (fs.existsSync(SERVER_INFO_PATH)) {
    const { pid } = JSON.parse(fs.readFileSync(SERVER_INFO_PATH, 'utf8'))
    if (pid && pid !== child?.pid) killTree(pid)
    fs.unlinkSync(SERVER_INFO_PATH)
  }
}
