import 'dotenv/config'
import {
  appProvider,
  databaseProvider,
  envLoadProvider,
} from './shared/providers'
;(async () => {
  envLoadProvider.validate()
  await databaseProvider.initialize()
  appProvider.listen()
})()
