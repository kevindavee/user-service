import { Gender, User } from 'src/domains';
import { UserService } from 'src/services';
import { SecretGenMock, UserRepoMock } from './mocks';

describe('get()', () => {
  it('should succesfully return a list of users', async () => {
    const dob = new Date(1996, 5, 15);
    const user1 = User.NewUser('id-1', 'kevin dave', dob, 'Indonesia', Gender.MALE);
    const user2 = User.NewUser('id-2', 'kevin dave 2', dob, 'Indonesia', Gender.FEMALE);
    const userRepoMock = {
      ...UserRepoMock,
      get: jest.fn().mockResolvedValue([[user1, user2], null])
    }

    const service = new UserService(userRepoMock, SecretGenMock);
    const [result, err] = await service.get();

    expect(result).toEqual([user1, user2]);
    expect(err).toBeNil();
  });

  it('should return error from repo', async () => {
    const userRepoMock = {
      ...UserRepoMock,
      get: jest.fn().mockResolvedValue([null, new Error('Something was messed up from DB')]),
    };

    const service = new UserService(userRepoMock, SecretGenMock);
    const [result, err] = await service.get();

    expect(result).toBeNil();
    expect(err).toEqual(new Error('Something was messed up from DB'));
  });
});
