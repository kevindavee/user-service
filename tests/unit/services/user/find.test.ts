import { CustomError, Gender, User } from 'src/domains';
import { UserService } from 'src/services';
import { SecretGenMock, UserRepoMock } from './mocks';

describe('find()', () => {
  it('should succesfully return a user', async () => {
    const dob = new Date(1996, 5, 15);
    const user = User.NewUser('id', 'kevin dave', dob, 'Indonesia', Gender.MALE);
    const userRepoMock = {
      ...UserRepoMock,
      find: jest.fn().mockResolvedValue([user, null])
    }

    const service = new UserService(userRepoMock, SecretGenMock);
    const [result, err] = await service.find('id');

    expect(result).toEqual(user);
    expect(err).toBeNil();

    expect(userRepoMock.find).toBeCalledWith('id');
  });

  it('should return error with error code of DATA_NOT_FOUND_ERROR if the data doesn\'t exist', async () => {
    const userRepoMock = {
      ...UserRepoMock,
      find: jest.fn().mockResolvedValue([null, new CustomError('DATA_NOT_FOUND_ERROR', 'Data doesn\'t exist')]),
    };

    const service = new UserService(userRepoMock, SecretGenMock);
    const [result, err] = await service.find('id');
    const errResult = err as CustomError;

    expect(result).toBeNil();
    expect(errResult.errorCode).toEqual('DATA_NOT_FOUND_ERROR');

    expect(userRepoMock.find).toBeCalledWith('id');
  });

  it('should return error from repo', async () => {
    const userRepoMock = {
      ...UserRepoMock,
      find: jest.fn().mockResolvedValue([null, new Error('Something was messed up from DB')]),
    };

    const service = new UserService(userRepoMock, SecretGenMock);
    const [result, err] = await service.find('id');

    expect(result).toBeNil();
    expect(err).toEqual(new Error('Something was messed up from DB'));

    expect(userRepoMock.find).toBeCalledWith('id');
  });
});
