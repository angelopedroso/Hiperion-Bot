import { Prisma, PrismaClient } from '@prisma/client'
import { createPrismaRedisCache } from 'prisma-redis-middleware'
import Redis from 'ioredis'
import { REDIS_URI } from '@utils/envs'

const redis = new Redis(REDIS_URI) // Is optional, you can use the local redis, just leave Redis empty

const prisma = new PrismaClient()

function cacheMiddleware() {
  const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
    models: [
      { model: 'Group', cacheTime: 60 * 10 },
      { model: 'AntiTrava', cacheTime: 60 * 10 },
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
