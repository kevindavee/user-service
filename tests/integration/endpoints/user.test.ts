import supertest from 'supertest';
import { getConnection, Connection, Repository } from 'typeorm';
import { Application } from 'express';
import { Gender, User } from 'src/domains';
import { createApp } from 'src/app';
import { send } from 'process';

describe('User endpoints integration tests', () => {
  let server: Application;
  let connection: Connection;
  let userRepo: Repository<User>;

  beforeAll(async () => {
    server = await createApp();
    connection = getConnection();
    await connection.dropDatabase();
    await connection.runMigrations();

    userRepo = connection.getRepository(User);
  });

  beforeEach(async() => {
    await userRepo.delete({});
  })

  describe('GET /tokens', () => {
    it('should return an array of users if it\'s not empty', async () => {
      const dob = new Date();
      const user = User.NewUser('id', 'kevin dave', dob, 'Indonesia', Gender.MALE);
      await userRepo.save(user);

      const response = await supertest(server)
        .get('/users')
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{
        id: 'id',
        full_name: 'kevin dave',
        gender: 'MALE',
        date_of_birth: dob.toISOString(),
        address: 'Indonesia'
      }]);
    });

    it('should return an empty array if it\'s empty', async () => {
      const response = await supertest(server)
        .get('/users')
        .send({});

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user', async () => {
      const dob = new Date();
      const user = User.NewUser('id', 'kevin dave', dob, 'Indonesia', Gender.MALE);
      await userRepo.save(user);

      const response = await supertest(server)
        .get('/users/id')
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'id',
        full_name: 'kevin dave',
        gender: 'MALE',
        date_of_birth: dob.toISOString(),
        address: 'Indonesia'
      });
    });

    it('should return an DATA_NOT_FOUND_ERROR if data doesn\'t exist', async () => {
      const response = await supertest(server)
        .get('/users/id')
        send({});

      expect(response.status).toBe(404);
      expect(response.body.error_code).toEqual('DATA_NOT_FOUND_ERROR');
    });
  });

  describe('POST /users', () => {
    it('should successfully returns created user', async () => {
      const response = await supertest(server)
        .post('/users')
        .send({
          full_name: 'kevin dave',
          gender: 'MALE',
          date_of_birth: '2020-05-15T00:00:00.000Z',
          address: 'Indonesia'
        });

      expect(response.status).toBe(201);
      expect(response.body.full_name).toEqual('kevin dave');
      expect(response.body.gender).toEqual('MALE');
      expect(response.body.date_of_birth).toEqual('2020-05-15T00:00:00.000Z');
      expect(response.body.address).toEqual('Indonesia');
    });
  });

  describe('PUT /users/:id', () => {
    it('should successfully returns updated user', async () => {
      const dob = new Date();
      const user = User.NewUser('id', 'kevin dave', dob, 'Indonesia', Gender.MALE);
      await userRepo.save(user);

      const response = await supertest(server)
        .put('/users/id')
        .send({
          full_name: 'not kevin dave',
          gender: 'FEMALE',
          date_of_birth: '2019-05-15T00:00:00.000Z',
          address: 'not Indonesia'
        });

      expect(response.status).toBe(200);
      expect(response.body.full_name).toEqual('not kevin dave');
      expect(response.body.gender).toEqual('FEMALE');
      expect(response.body.date_of_birth).toEqual('2019-05-15T00:00:00.000Z');
      expect(response.body.address).toEqual('not Indonesia');
    });

    it('should return DATA_NOT_FOUND_ERROR if user doesn\'t exist', async () => {
      const response = await supertest(server)
        .put('/users/id')
        .send({
          full_name: 'not kevin dave',
          gender: 'FEMALE',
          date_of_birth: '2019-05-15T00:00:00.000Z',
          address: 'not Indonesia'
        });

      expect(response.status).toBe(404);
      expect(response.body.error_code).toEqual('DATA_NOT_FOUND_ERROR');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should return 204 status code if user successfully deleted', async () => {
      const dob = new Date();
      const user = User.NewUser('id', 'kevin dave', dob, 'Indonesia', Gender.MALE);
      await userRepo.save(user);

      const response = await supertest(server)
        .delete('/users/id')
        .send({})

      expect(response.status).toBe(204);
    });

    it('should return DATA_NOT_FOUND_ERROR if user doesn\'t exist', async () => {
      const response = await supertest(server)
        .delete('/users/id')
        .send({});

      expect(response.status).toBe(404);
      expect(response.body.error_code).toEqual('DATA_NOT_FOUND_ERROR');
    });
  })
});
