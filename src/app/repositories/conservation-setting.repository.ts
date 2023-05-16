import { Repository } from 'typeorm'
import dataSource from '../../shared/configs/data-source.config'
import { ConservationSetting } from '../entities'
import { UpdateConservationSettingDto } from '../dtos'

export class ConservationSettingRepository extends Repository<ConservationSetting> {
  constructor() {
    super(ConservationSetting, dataSource.manager)
  }

  public async updateSetting(id: string, data: UpdateConservationSettingDto) {
    await this.createQueryBuilder()
      .update(ConservationSetting)
      .set({ ...data })
      .where('id = :id')
      .setParameters({ id })
      .execute()
  }
}
