import 'reflect-metadata';
import { Application } from 'express';
import { getConnection } from 'typeorm';
import { connect } from './db-connect';
import { UserRepo } from './libs/typeorm';
import { SecretGenerator } from './libs/secret';
import { User } from './domains';
import { UserService } from './services';
import { UserController } from './controllers';

export interface IController {
  install(app: Application): void;
}

export async function init(): Promise<IController[]> {
  await connect();
  const connection = await getConnection();

  const userRepo = new UserRepo(connection.getRepository(User));
  const secretGenerator = new SecretGenerator();

  const userService = new UserService(userRepo, secretGenerator);

  const userController = new UserController(userService);

  return [userController]
}
