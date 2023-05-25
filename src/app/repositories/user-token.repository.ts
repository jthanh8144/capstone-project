import { Repository } from 'typeorm'
import dataSource from '../../shared/configs/data-source.config'
import { UserToken } from '../entities'

export class UserTokenRepository extends Repository<UserToken> {
  constructor() {
    super(UserToken, dataSource.manager)
  }
}
