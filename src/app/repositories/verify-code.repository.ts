import { Repository } from 'typeorm'
import dataSource from '../../shared/configs/data-source.config'
import { VerifyCode } from '../entities'

export class VerifyCodeRepository extends Repository<VerifyCode> {
  constructor() {
    super(VerifyCode, dataSource.manager)
  }
}
