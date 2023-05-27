import 'dotenv/config'
import { initializeApp, cert } from 'firebase-admin/app'

import {
  appProvider,
  envLoadProvider,
  databaseProvider,
  socketProvider,
} from './shared/providers'
import { firebaseConfig } from './shared/configs/firebase.config'
;(async () => {
  initializeApp({
    credential: cert(firebaseConfig as any),
  })
  envLoadProvider.validate()
  await databaseProvider.initialize()
  appProvider.listen()
  socketProvider.initialize()
})()
