import { Entity, Index, PrimaryColumn, Column } from 'typeorm';
import { Gender } from './gender';

@Entity({ name: 'users'})
@Index(['fullName'], { unique: false})
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'full_name'})
  fullName: string;

  @Column({ name: 'gender' })
  gender: Gender;

  @Column({ name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column({ name: 'address' })
  address: string;

  @Column({ name: 'is_soft_deleted' })
  isSoftDeleted: boolean;

  @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  static NewUser(id: string, fullName: string, dateOfBirth: Date, address: string, gender: Gender): User {
    const user = new User();
    user.id = id;
    user.fullName = fullName;
    user.gender = gender;
    user.dateOfBirth = dateOfBirth;
    user.address = address;
    user.isSoftDeleted = false;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    return user;
  }
}
