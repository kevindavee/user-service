import { Application, Router, Request, Response, NextFunction } from 'express';
import { Gender, User } from 'src/domains';
import { ICreateUserReq, IUpdateUserReq } from 'src/services/user';

export interface IUserService {
  get(): Promise<[User[], Error]>;
  find(id: string): Promise<[User, Error]>;
  create(createReq: ICreateUserReq): Promise<[User, Error]>;
  update(updateReq: IUpdateUserReq): Promise<[User, Error]>;
  delete(id: string): Promise<Error>;
}

export class UserController {
  private readonly userService: IUserService;

  private router: Router;

  public constructor(userService: IUserService) {
    this.userService = userService;
    this.router = Router();
    this.router.get('/', this.get.bind(this));
    this.router.get('/:id', this.find.bind(this));
    this.router.post('/', this.create.bind(this));
    this.router.put('/:id', this.update.bind(this));
    this.router.delete('/:id', this.delete.bind(this));
  }

  install(app: Application): void {
    app.use('/users', this.router);
  }

  public async get(_: Request, res: Response, next: NextFunction) {
    const [result, err] = await this.userService.get();
    if (err) {
      return next(err);
    }

    return res.status(200).json(result.map(u => ({
      id: u.id,
      full_name: u.fullName,
      date_of_birth: u.dateOfBirth.toISOString(),
      gender: u.gender,
      address: u.address
    })));
  }

  public async find(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const [result, err] = await this.userService.find(id);
    if (err) {
      return next(err);
    }

    return res.status(200).json({
      id: result.id,
      full_name: result.fullName,
      date_of_birth: result.dateOfBirth.toISOString(),
      gender: result.gender,
      address: result.address
    });
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    const {
      full_name: fullName,
      date_of_birth: dateOfBirth,
      gender,
      address
    } = req.body

    const [result, err] = await this.userService.create({
      fullName,
      dateOfBirth: new Date(dateOfBirth),
      gender: gender as Gender,
      address
    });
    if (err) {
      return next(err);
    }

    return res.status(201).json({
      id: result.id,
      full_name: result.fullName,
      date_of_birth: result.dateOfBirth.toISOString(),
      gender: result.gender,
      address: result.address
    });
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    const {
      full_name: fullName,
      date_of_birth: dateOfBirth,
      gender,
      address
    } = req.body
    const { id } = req.params;
    const [result, err] = await this.userService.update({
      id,
      fullName,
      dateOfBirth: new Date(dateOfBirth),
      gender: gender as Gender,
      address
    });
    if (err) {
      return next(err);
    }

    return res.status(200).json({
      id: result.id,
      full_name: result.fullName,
      date_of_birth: result.dateOfBirth.toISOString(),
      gender: result.gender,
      address: result.address
    });
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const err = await this.userService.delete(id);
    if (err) {
      return next(err);
    }

    return res.status(204).end();
  }
}
