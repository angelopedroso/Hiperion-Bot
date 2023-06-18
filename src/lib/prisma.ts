import { Prisma, PrismaClient } from '@prisma/client'
import { createPrismaRedisCache } from 'prisma-redis-middleware'
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URI ? process.env.REDIS_URI : '') // Uses default options for Redis connection

const prisma = new PrismaClient()

function cacheMiddleware() {
  const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
    models: [
      { model: 'Group', cacheTime: 180 },
      { model: 'AntiTrava', cacheTime: 600 },
    ],
    storage: {
      type: 'redis',
      options: {
        client: redis,
        invalidation: { referencesTTL: 601 },
      },
    },
    excludeModels: ['Participant', 'ParticipantGroupType'],
    excludeMethods: ['count', 'groupBy'],
  })

  prisma.$use(cacheMiddleware)
}

export { prisma, redis, cacheMiddleware }
