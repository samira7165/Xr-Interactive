import { getMariaDbConfig } from '@/lib/db-config'

describe('getMariaDbConfig', () => {
  it('parses host, port, user, password, and database from the URL', () => {
    const config = getMariaDbConfig('mysql://admin:secret@db.example.com:21756/mydb')
    expect(config).toMatchObject({
      host: 'db.example.com',
      port: 21756,
      user: 'admin',
      password: 'secret',
      database: 'mydb',
    })
  })

  it('defaults to port 3306 when no port is specified', () => {
    expect(getMariaDbConfig('mysql://admin:secret@db.example.com/mydb').port).toBe(3306)
  })

  it('strips the leading slash from the database name', () => {
    expect(getMariaDbConfig('mysql://admin:secret@db.example.com/mydb').database).toBe('mydb')
  })

  it('adds rejectUnauthorized: false ssl config when ssl=true', () => {
    const config = getMariaDbConfig('mysql://admin:secret@db.example.com/mydb?ssl=true')
    expect(config.ssl).toEqual({ rejectUnauthorized: false })
  })

  it('omits ssl config when the ssl param is absent', () => {
    expect(getMariaDbConfig('mysql://admin:secret@db.example.com/mydb').ssl).toBeUndefined()
  })

  it('omits ssl config when ssl=false', () => {
    expect(getMariaDbConfig('mysql://admin:secret@db.example.com/mydb?ssl=false').ssl).toBeUndefined()
  })

  it('percent-decodes a properly encoded password', () => {
    // %25 is an encoded literal "%", so this represents the password "50%offbad"
    const config = getMariaDbConfig('mysql://root:50%25offbad@localhost/db')
    expect(config.password).toBe('50%offbad')
  })

  it('falls back to the raw password when it contains an unescaped %', () => {
    // "%of" isn't valid percent-encoding, so decodeURIComponent would throw —
    // safeDecode() must catch that and return the literal string instead.
    const config = getMariaDbConfig('mysql://root:50%offbad@localhost/db')
    expect(config.password).toBe('50%offbad')
  })

  it('sets a generous connectTimeout and a modest connectionLimit', () => {
    const config = getMariaDbConfig('mysql://admin:secret@db.example.com/mydb')
    expect(config.connectTimeout).toBe(20000)
    expect(config.connectionLimit).toBe(5)
  })
})
