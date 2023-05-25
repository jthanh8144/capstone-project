import { Repository } from 'typeorm'
import dataSource from '../../shared/configs/data-source.config'
import { Conservation } from '../entities'

export class ConservationRepository extends Repository<Conservation> {
  constructor() {
    super(Conservation, dataSource.manager)
  }
}
