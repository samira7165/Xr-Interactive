import 'server-only'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from './generated/prisma/index.js'
import { getMariaDbConfig } from './db-config.js'

const globalForPrisma = globalThis

const adapter = new PrismaMariaDb(getMariaDbConfig(process.env.DATABASE_URL))

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
