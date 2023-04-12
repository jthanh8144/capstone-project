import 'dotenv/config'
import {
  appProvider,
  envLoadProvider,
  databaseProvider,
  socketProvider,
} from './shared/providers'
;(async () => {
  envLoadProvider.validate()
  await databaseProvider.initialize()
  appProvider.listen()
  socketProvider.initialize()
})()
