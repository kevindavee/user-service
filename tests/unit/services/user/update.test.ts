import MockDate from 'mockdate';
import { CustomError, Gender, User } from 'src/domains';
import { UserService } from 'src/services';
import { SecretGenMock, UserRepoMock } from './mocks';

describe('update()', () => {
  const mockNowDate = new Date('1/1/2020');
  MockDate.set(mockNowDate);

  it('should successfully return a user after update', async () => {
    const dob = new Date(1996, 5, 15);
    const updatedDob = new Date(1996, 5, 16);
    const user = User.NewUser('id', 'kevin dave', dob, 'Indonesia', Gender.MALE);
    const userRepoMock = {
      ...UserRepoMock,
      find: jest.fn().mockResolvedValue([user, null]),
      update: jest.fn().mockResolvedValue(null)
    }

    const service = new UserService(userRepoMock, SecretGenMock);
    const [result, err] = await service.update({
      id: 'id',
      fullName: 'not kevin dave',
      address: 'not Indonesia',
      gender: Gender.FEMALE,
      dateOfBirth: updatedDob
    });

    expect(result).toEqual({
      id: 'id',
      fullName: 'not kevin dave',
      address: 'not Indonesia',
      gender: Gender.FEMALE,
      dateOfBirth: updatedDob,
      createdAt: mockNowDate,
      updatedAt: mockNowDate,
      isSoftDeleted: false
    } as User)
    expect(err).toBeNil();

    expect(userRepoMock.find).toBeCalledWith('id');
    expect(userRepoMock.update).toBeCalledWith({
      id: 'id',
      fullName: 'not kevin dave',
      address: 'not Indonesia',
      gender: Gender.FEMALE,
      dateOfBirth: updatedDob,
      createdAt: mockNowDate,
      updatedAt: mockNowDate,
      isSoftDeleted: false
    } as User)
  });

  it('should return error with error code of DATA_NOT_FOUND_ERROR if the data doesn\'t exist', async () => {
    const updatedDob = new Date(1996, 5, 16);
    const userRepoMock = {
      ...UserRepoMock,
      find: jest.fn().mockResolvedValue([null, new CustomError('DATA_NOT_FOUND_ERROR', 'Data doesn\'t exist')]),
    };

    const service = new UserService(userRepoMock, SecretGenMock);
    const [result, err] = await service.update({
      id: 'id',
      fullName: 'not kevin dave',
      address: 'not Indonesia',
      gender: Gender.FEMALE,
      dateOfBirth: updatedDob
    });
    const errResult = err as CustomError;

    expect(result).toBeNil();
    expect(errResult.errorCode).toEqual('DATA_NOT_FOUND_ERROR');

    expect(userRepoMock.find).toBeCalledWith('id');
    expect(userRepoMock.update).not.toBeCalled();
  });

  it('should return error from repo during find process', async () => {
    const updatedDob = new Date(1996, 5, 16);
    const userRepoMock = {
      ...UserRepoMock,
      find: jest.fn().mockResolvedValue([null, new Error('Something was messed up from DB')]),
    };

    const service = new UserService(userRepoMock, SecretGenMock);
    const [result, err] = await service.update({
      id: 'id',
      fullName: 'not kevin dave',
      address: 'not Indonesia',
      gender: Gender.FEMALE,
      dateOfBirth: updatedDob
    });

    expect(result).toBeNil();
    expect(err).toEqual(new Error('Something was messed up from DB'));

    expect(userRepoMock.find).toBeCalledWith('id');
    expect(userRepoMock.update).not.toBeCalled();
  });

  it('should return error from repo during update process', async () => {
    const updatedDob = new Date(1996, 5, 16);
    const dob = new Date(1996, 5, 15);
    const user = User.NewUser('id', 'kevin dave', dob, 'Indonesia', Gender.MALE);
    const userRepoMock = {
      ...UserRepoMock,
      find: jest.fn().mockResolvedValue([user, null]),
      update: jest.fn().mockResolvedValue(new Error('Something was messed up from DB'))
    };

    const service = new UserService(userRepoMock, SecretGenMock);
    const [result, err] = await service.update({
      id: 'id',
      fullName: 'not kevin dave',
      address: 'not Indonesia',
      gender: Gender.FEMALE,
      dateOfBirth: updatedDob
    });

    expect(result).toBeNil();
    expect(err).toEqual(new Error('Something was messed up from DB'));

    expect(userRepoMock.find).toBeCalledWith('id');
    expect(userRepoMock.update).toBeCalledWith({
      id: 'id',
      fullName: 'not kevin dave',
      address: 'not Indonesia',
      gender: Gender.FEMALE,
      dateOfBirth: updatedDob,
      createdAt: mockNowDate,
      updatedAt: mockNowDate,
      isSoftDeleted: false
    } as User);
  });
});
