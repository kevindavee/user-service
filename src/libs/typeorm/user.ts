import { Repository } from 'typeorm';
import { CustomError, User } from 'src/domains';

export class UserRepo {
  private repo: Repository<User>;

  constructor(repo: Repository<User>) {
    this.repo = repo;
  }

  async get(): Promise<[User[], Error]> {
    try {
      const result = await this.repo.find();
      return [result, null];
    } catch (error) {
      return [null, error];
    }
  }

  async find(id: string): Promise<[User, Error]> {
    try {
      const result = await this.repo.findOne({
        where: {
          id,
          isSoftDeleted: false,
        }
      });

      if (result == null) {
        return [null, new CustomError('DATA_NOT_FOUND_ERROR', 'Data doesn\'t exist', null, {
          id
        })]
      }

      return [result, null];
    } catch (error) {
      return [null, error];
    }
  }

  async create(item: User): Promise<Error> {
    try {
      await this.repo.save(item);
      return null;
    } catch (error) {
      return error;
    }
  }

  async update(item: User): Promise<Error> {
    item.updatedAt = new Date();

    try {
      await this.repo.save(item);
      return null;
    } catch (error) {
      return error;
    }
  }

  async delete(id: string): Promise<Error> {
    try {
      const result = await this.repo.update(id, {
        isSoftDeleted: true,
        updatedAt: true,
      });

      if (result.affected == 0) {
        return new CustomError('DATA_NOT_FOUND_ERROR', 'Data doesn\'t exist', null, {
          id
        });
      }
    } catch (error) {
      return error;
    }
  }
}
