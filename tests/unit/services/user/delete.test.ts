import { CustomError } from 'src/domains';
import { UserService } from 'src/services';
import { SecretGenMock, UserRepoMock } from './mocks';

describe('delete()', () => {
  it('should return null if successfully delete a user', async () => {
    const userRepoMock = {
      ...UserRepoMock,
      delete: jest.fn().mockResolvedValue(null)
    }

    const service = new UserService(userRepoMock, SecretGenMock);
    const err = await service.delete('id');

    expect(err).toBeNil();

    expect(userRepoMock.delete).toBeCalledWith('id');
  });

  it('should return error with error code of DATA_NOT_FOUND_ERROR if the data doesn\'t exist', async () => {
    const userRepoMock = {
      ...UserRepoMock,
      delete: jest.fn().mockResolvedValue(new CustomError('DATA_NOT_FOUND_ERROR', 'Data doesn\'t exist')),
    };

    const service = new UserService(userRepoMock, SecretGenMock);
    const err = await service.delete('id');
    const errResult = err as CustomError;

    expect(errResult.errorCode).toEqual('DATA_NOT_FOUND_ERROR');

    expect(userRepoMock.delete).toBeCalledWith('id');
  });

  it('should return error from repo', async () => {
    const userRepoMock = {
      ...UserRepoMock,
      delete: jest.fn().mockResolvedValue(new Error('Something was messed up from DB')),
    };

    const service = new UserService(userRepoMock, SecretGenMock);
    const err = await service.delete('id');

    expect(err).toEqual(new Error('Something was messed up from DB'));

    expect(userRepoMock.delete).toBeCalledWith('id');
  });
});
