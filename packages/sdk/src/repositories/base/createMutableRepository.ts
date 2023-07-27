import type { z } from 'zod'

import createReadOnlyRepository from './createReadOnlyRepository'
import type { Entity, MutableRepository, MutableRepositoryDriver } from './types'

export default function createMutableRepository<R extends Entity>(
  repoId: string,
  driver: MutableRepositoryDriver,
  schema: z.ZodSchema<any>,
  dataFile: string = `data/${repoId}.json`
): MutableRepository<R> {
  const baseRepo = createReadOnlyRepository<R>(repoId, driver, schema, dataFile, 0)
  const repo: MutableRepository<R> = {
    ...baseRepo,
    create() {
      throw new Error('Not implemented')
    },
    createMany() {
      throw new Error('Not implemented')
    },
    delete() {
      throw new Error('Not implemented')
    },
    deleteMany() {
      throw new Error('Not implemented')
    },
    update() {
      throw new Error('Not implemented')
    },
    updateMany() {
      throw new Error('Not implemented')
    },
  }

  return repo
}
