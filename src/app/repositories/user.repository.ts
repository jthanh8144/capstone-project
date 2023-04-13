import { Repository } from 'typeorm'
import dataSource from '../../shared/configs/data-source.config'
import { User } from '../entities'
import { CreateUserDto, UpdateUserDto } from '../dtos'

export class UserRepository extends Repository<User> {
  constructor() {
    super(User, dataSource.manager)
  }

  public getUserByEmail(email: string) {
    return this.findOne({ where: { email } })
  }

  public createUser(data: CreateUserDto) {
    return this.save(this.create(data))
  }

  public async updateUser(id: string, data: UpdateUserDto) {
    await this.createQueryBuilder()
      .update(User)
      .set({ ...data })
      .where('id = :id')
      .setParameters({ id })
      .execute()
  }
}
