import { Gender, User } from "src/domains";

interface IWriteUserReq {
  fullName: string;
  gender: Gender;
  dateOfBirth: Date;
  address: string;
}

export interface ICreateUserReq extends IWriteUserReq {}

export interface IUpdateUserReq extends IWriteUserReq {
  id: string;
}

export interface IUserRepo {
  get(): Promise<[User[], Error]>;
  find(id: string): Promise<[User, Error]>;
  create(item: User): Promise<Error>;
  update(item: User): Promise<Error>;
  delete(id: string): Promise<Error>;
}

export interface ISecretGenerator {
  generateID(): string;
}

export class UserService {
  private userRepo: IUserRepo;

  private secretGenerator: ISecretGenerator;

  constructor(userRepo: IUserRepo, secretGenerator: ISecretGenerator) {
    this.userRepo = userRepo;
    this.secretGenerator = secretGenerator;
  }

  async get(): Promise<[User[], Error]> {
    const [users, err] = await this.userRepo.get();
    return [users, err];
  }

  async find(id: string): Promise<[User, Error]> {
    const [user, err] = await this.userRepo.find(id);
    return [user, err];
  }

  async create(createReq: ICreateUserReq): Promise<[User, Error]> {
    const { fullName, address, dateOfBirth, gender } = createReq;
    const id = this.secretGenerator.generateID();
    const user = User.NewUser(id, fullName, dateOfBirth, address, gender);
    const err = await this.userRepo.create(user)
    if (err) {
      return [null, err];
    }

    return [user, null];
  }

  async update(updateReq: IUpdateUserReq): Promise<[User, Error]> {
    const { id, fullName, address, dateOfBirth, gender } = updateReq;
    const [findUser, err] = await this.userRepo.find(id);
    if (err) {
      return [findUser, err];
    }

    findUser.fullName = fullName;
    findUser.address = address;
    findUser.dateOfBirth = dateOfBirth;
    findUser.gender = gender;

    const updateErr = await this.userRepo.update(findUser);
    if (updateErr) {
      return [null, updateErr];
    }

    return [findUser, null];
  }

  async delete(id: string): Promise<Error> {
    const err = await this.userRepo.delete(id);
    return err;
  }
}
