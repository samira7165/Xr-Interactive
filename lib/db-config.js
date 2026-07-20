// Parses DATABASE_URL into a mariadb pool config object instead of passing the raw
// string straight to the driver. Needed because the `mariadb` package's own
// connection-string parser only understands `ssl=true|false` (a plain boolean) — it
// can't express `rejectUnauthorized: false`, which managed hosts like Aiven require
// since their certificate chain isn't in Node's default trusted root store.
// url.username/password are already percent-decoded by the URL parser for
// the common case, but a raw '%' not followed by two hex digits (a password
// like "50%off" pasted in unencoded) makes decodeURIComponent throw — fall
// back to the raw value instead of crashing the whole app at module load.
function safeDecode(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function getMariaDbConfig(databaseUrl) {
  const url = new URL(databaseUrl)
  const sslParam = url.searchParams.get('ssl')

  const config = {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: safeDecode(url.username),
    password: safeDecode(url.password),
    database: url.pathname.replace(/^\//, ''),
    // The mariadb driver's default socket-connect timeout is too aggressive for
    // some hosting environments' network path to a remote managed database
    // (observed failing on Vercel's build servers reaching Aiven, despite working
    // fine locally) — give it more room before giving up.
    connectTimeout: 20000,
    // Kept modest on purpose: Aiven's free-tier plan caps total server-side
    // connections quite low, and Vercel can run several serverless instances
    // concurrently, each with its own pool — a high per-instance limit here
    // risks exhausting the server's connection cap across instances rather
    // than actually helping any single request.
    connectionLimit: 5,
  }

  if (sslParam === 'true') {
    config.ssl = { rejectUnauthorized: false }
  }

  return config
}
