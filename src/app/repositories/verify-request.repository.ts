import { Repository } from 'typeorm'
import dataSource from '../../shared/configs/data-source.config'
import { VerifyRequest } from '../entities'

export class VerifyRequestRepository extends Repository<VerifyRequest> {
  constructor() {
    super(VerifyRequest, dataSource.manager)
  }
}
