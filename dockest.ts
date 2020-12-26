import { Dockest, logLevel } from 'dockest'; // eslint-disable-line
import jest from 'jest'; // eslint-disable-line

const { run } = new Dockest({
  composeFile: ['docker-compose.test.yml'],
  dumpErrors: true,
  jestLib: jest,
  logLevel: logLevel.DEBUG,
  jestOpts: {
    testPathPattern: ['./tests/integration/.*\\.ts'],
    collectCoverage: true,
    coveragePathIgnorePatterns: [
      '/node_modules/',
      'dist/',
      'src/server.ts',
      'src/db-connect.ts',
      'src/module-alias.ts',
      'src/cmd',
      'src/libs/typeorm/migrations',
      'src/libs/typeorm/ormconfig-cli.ts',
      'src/libs/sleep',
    ],
  },
});

run([
  {
    serviceName: 'postgres-test',
    readinessCheck: ({
      defaultReadinessChecks: { postgres },
      dockerComposeFileService: {
        environment: { POSTGRES_DB, POSTGRES_USER },
      },
    }) => postgres({ POSTGRES_DB, POSTGRES_USER }),
  },
]);
