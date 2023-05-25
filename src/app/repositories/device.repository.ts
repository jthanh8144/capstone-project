import { Repository } from 'typeorm'
import dataSource from '../../shared/configs/data-source.config'
import { Device } from '../entities'

export class DeviceRepository extends Repository<Device> {
  constructor() {
    super(Device, dataSource.manager)
  }
}
