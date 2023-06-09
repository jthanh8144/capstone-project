import { createClient } from 'redis'

import { environment } from '../constants'

export default createClient({
  url: `redis://${environment.redis.host}:${environment.redis.port}`,
  password: environment.redis.password,
})
