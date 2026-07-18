// Parses DATABASE_URL into a mariadb pool config object instead of passing the raw
// string straight to the driver. Needed because the `mariadb` package's own
// connection-string parser only understands `ssl=true|false` (a plain boolean) — it
// can't express `rejectUnauthorized: false`, which managed hosts like Aiven require
// since their certificate chain isn't in Node's default trusted root store.
export function getMariaDbConfig(databaseUrl) {
  const url = new URL(databaseUrl)
  const sslParam = url.searchParams.get('ssl')

  const config = {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ''),
  }

  if (sslParam === 'true') {
    config.ssl = { rejectUnauthorized: false }
  }

  return config
}
