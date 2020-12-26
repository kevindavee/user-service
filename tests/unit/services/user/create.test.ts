import MockDate from 'mockdate';
import { Gender, User } from 'src/domains';
import { UserService } from 'src/services';
import { SecretGenMock, UserRepoMock } from './mocks';

describe('create()', () => {
  const mockNowDate = new Date('1/1/2020');
  MockDate.set(mockNowDate);

  it('should succesfully return a user', async () => {
    const dob = new Date(1996, 5, 15);
    const user = User.NewUser('id', 'kevin dave', dob, 'Indonesia', Gender.MALE);
    const userRepoMock = {
      ...UserRepoMock,
      create: jest.fn().mockResolvedValue(null)
    }

    const service = new UserService(userRepoMock, SecretGenMock);
    const [result, err] = await service.create({
      fullName: 'kevin dave',
      dateOfBirth: dob,
      gender: Gender.MALE,
      address: 'Indonesia'
    });

    expect(result).toEqual(user);
    expect(err).toBeNil();

    expect(userRepoMock.create).toBeCalledWith({
      id: 'id',
      fullName: 'kevin dave',
      dateOfBirth: dob,
      address: 'Indonesia',
      gender: 'MALE',
      isSoftDeleted: false,
      createdAt: mockNowDate,
      updatedAt: mockNowDate
    } as User)
  });

  it('should return error from repo', async () => {
    const dob = new Date(1996, 5, 15);
    const userRepoMock = {
      ...UserRepoMock,
      create: jest.fn().mockResolvedValue(new Error('Something bad happened in our DB')),
    };

    const service = new UserService(userRepoMock, SecretGenMock);
    const [result, err] = await service.create({
      fullName: 'kevin dave',
      dateOfBirth: dob,
      gender: Gender.MALE,
      address: 'Indonesia'
    });

    expect(result).toBeNil();
    expect(err).toEqual(new Error('Something bad happened in our DB'));

    expect(userRepoMock.create).toBeCalledWith({
      id: 'id',
      fullName: 'kevin dave',
      dateOfBirth: dob,
      address: 'Indonesia',
      gender: 'MALE',
      isSoftDeleted: false,
      createdAt: mockNowDate,
      updatedAt: mockNowDate
    } as User)
  });
});
