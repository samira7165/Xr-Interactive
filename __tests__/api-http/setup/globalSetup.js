import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadEnv } from 'dotenv'

const ROOT = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
// dotenv's config() never overrides a var that's already set, so this is
// safe to call even if the env is already populated some other way.
loadEnv({ path: path.join(ROOT, '.env.test') })

const PORT = process.env.TEST_SERVER_PORT || '3100'
const BASE_URL = `http://localhost:${PORT}`
const READY_TIMEOUT_MS = 90_000
const POLL_INTERVAL_MS = 500

// globalSetup/globalTeardown run in the same parent process but test files
// run in separate worker processes, so the server's base URL and pid are
// handed off through a file rather than a shared JS variable.
export const SERVER_INFO_PATH = path.join(os.tmpdir(), 'xri-api-test-server.json')

async function waitUntilReady(logs) {
  const deadline = Date.now() + READY_TIMEOUT_MS
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE_URL}/api/services`)
      if (res.status) return
    } catch {
      // Not accepting connections yet — keep polling.
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
  }
  throw new Error(
    `Test server did not respond at ${BASE_URL} within ${READY_TIMEOUT_MS}ms.\n--- server output ---\n${logs.join('')}`
  )
}

export default async function globalSetup() {
  if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.includes('/testdb')) {
    throw new Error(
      'DATABASE_URL is not pointed at testdb. Refusing to start the API test server against an unexpected database.'
    )
  }

  const logs = []
  // Spawn Next's own bin script directly through node — avoids both the
  // `npx.cmd` EINVAL issue on Windows (it's a shell script, not a real PE
  // binary you can spawn without a shell) and the arg-escaping risk of
  // `shell: true`.
  const nextBin = path.join(ROOT, 'node_modules', 'next', 'dist', 'bin', 'next')
  const child = spawn(process.execPath, [nextBin, 'dev', '-p', PORT], {
    cwd: ROOT,
    env: {
      ...process.env,
      NEXTAUTH_URL: BASE_URL,
      // Next 16's dev-server lock is keyed on distDir, not port — this keeps
      // the test server from colliding with a real `next dev` the developer
      // already has running against the default .next directory.
      API_TEST_DIST_DIR: '.next-api-test',
    },
    stdio: 'pipe',
  })
  child.stdout.on('data', (chunk) => logs.push(chunk.toString()))
  child.stderr.on('data', (chunk) => logs.push(chunk.toString()))

  try {
    await waitUntilReady(logs)
  } catch (err) {
    child.kill()
    throw err
  }

  fs.writeFileSync(SERVER_INFO_PATH, JSON.stringify({ pid: child.pid, baseUrl: BASE_URL }))
  process.env.API_TEST_BASE_URL = BASE_URL
  globalThis.__XRI_TEST_SERVER__ = child
}
