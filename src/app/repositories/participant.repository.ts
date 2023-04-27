import { Repository } from 'typeorm'
import dataSource from '../../shared/configs/data-source.config'
import { Participant } from '../entities'

export class ParticipantRepository extends Repository<Participant> {
  constructor() {
    super(Participant, dataSource.manager)
  }
}
