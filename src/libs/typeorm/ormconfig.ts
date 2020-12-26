import { ConnectionOptions } from 'typeorm';
import { entities } from './entities';
import { migrations } from './migrations';

const {
  // Envvars for default database connection
  PGHOST,
  PGPORT,
  PGUSER,
  PGPASSWORD,
  PGDATABASE,

  // Envvars for read replica database connection
  PGROHOST,
  PGROPORT,
  PGROUSER,
  PGROPASSWORD,

  NODE_ENV,
} = process.env;
const isProduction = NODE_ENV === 'production';

export const OrmConfig = {
  name: 'default',
  logging: !isProduction,
  entities,
  migrations,
  subscribers: [],
  cli: {
    entitiesDir: 'src/libs/typeorm/entities',
    migrationsDir: 'src/libs/typeorm/migrations',
    subscribersDir: 'src/libs/typeorm/subscribers',
  },

  // Will be overwritten by env vars refer .env.example
  type: 'postgres',
  extra: {
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 60000,
    statement_timeout: 360000, // 6 minutes
    max: 50,
  },
  replication: {
    // read-write connection
    master: {
      database: PGDATABASE || 'webhook-service',
      host: PGHOST || 'localhost',
      port: PGPORT || 5432,
      username: PGUSER || 'test',
      password: PGPASSWORD || 'test',
    },
    slaves: [
      {
        database: PGDATABASE || 'webhook-service',
        host: PGROHOST || PGHOST || 'localhost',
        port: PGROPORT || PGPORT || 5432,
        username: PGROUSER || PGUSER || 'test',
        password: PGROPASSWORD || PGPASSWORD || 'test',
      },
    ],
    // read-only connection
  },
} as ConnectionOptions;
