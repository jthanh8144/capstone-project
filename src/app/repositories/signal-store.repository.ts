import { Repository } from 'typeorm'
import dataSource from '../../shared/configs/data-source.config'
import { SignalStore } from '../entities'

export class SignalStoreRepository extends Repository<SignalStore> {
  constructor() {
    super(SignalStore, dataSource.manager)
  }
}
