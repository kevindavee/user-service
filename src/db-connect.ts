/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createConnection, Connection, ConnectionOptions } from 'typeorm';
import { PostgresDriver } from 'typeorm/driver/postgres/PostgresDriver';
import { Pool } from 'pg';

import { sleep } from 'src/libs/sleep';
import { logger } from 'src/libs/logger';
import { OrmConfig } from './libs/typeorm/ormconfig';

// Handles unstable/intermitten connection lost to DB
function connectionGuard(connection: Connection) {
  // Access underlying pg driver
  if (connection.driver instanceof PostgresDriver) {
    const pool = connection.driver.master as Pool;

    // Add handler on pool error event
    pool.on('error', async (err) => {
      logger.error(err, 'Connection pool erring out, Reconnecting...');
      try {
        await connection.close();
      } catch (innerErr) {
        logger.error(innerErr, 'Failed to close connection');
      }
      while (!connection.isConnected) {
        try {
          await connection.connect(); // eslint-disable-line
          logger.info('Reconnected DB');
        } catch (error) {
          logger.error(error, 'Reconnect Error');
        }

        if (!connection.isConnected) {
          // Throttle retry
          await sleep(500); // eslint-disable-line
        }
      }
    });
  }
}

// 1. Wait for db to come online and connect
// 2. On connection instability, able to reconnect
// 3. The app should never die due to connection issue
export async function connect(config?: ConnectionOptions) {
  let connection: Connection;
  let isConnected = false;
  const dbName = config ? config.name : 'default';

  logger.info(`Connecting to ${dbName} DB...`);
  while (!isConnected) {
    try {
      connection = await createConnection(config || OrmConfig); // eslint-disable-line
      isConnected = connection.isConnected;
    } catch (error) {
      logger.error(error, 'createConnection Error');
    }

    if (!isConnected) {
      // Throttle retry
      await sleep(500); // eslint-disable-line
    }
  }

  logger.info(`Connected to ${dbName} DB`);
  connectionGuard(connection);
}
