import { glob } from 'glob'
import { PostgreSqlContainer } from '@testcontainers/postgresql'
import * as path from 'node:path'

export const mockedUUID1 = 'fe63df90-dc63-4305-888e-66369b0d28f6'

export const FIXTURE_ALLOWED_LOCALHOST = 'http://localhost:5173'

export const databaseContainer = async (fixturePaths: string[]) => {
  const migrationFiles = await glob('prisma/migrations/*/migration.sql', {
    withFileTypes: true,
  })
  const migrations = migrationFiles.map((file) => ({
    source: file.fullpath(),
    target: `/docker-entrypoint-initdb.d/${file.parent?.name}.sql`,
  }))

  const fixtures = fixturePaths.map((fixture, index) => ({
    source: fixture,
    // rename files to make sure fixtures will be executed after migration
    target: `/docker-entrypoint-initdb.d/anything-${index}-${path.basename(fixture)}`,
  }))

  return await new PostgreSqlContainer('postgis/postgis')
    .withCopyFilesToContainer([...migrations, ...fixtures])
    .start()
}
