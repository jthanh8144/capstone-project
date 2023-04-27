import { Repository } from 'typeorm'
import dataSource from '../../shared/configs/data-source.config'
import { ConservationSetting } from '../entities'

export class ConservationSettingRepository extends Repository<ConservationSetting> {
  constructor() {
    super(ConservationSetting, dataSource.manager)
  }
}
