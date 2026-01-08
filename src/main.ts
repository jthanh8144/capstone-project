import 'dotenv/config'
import { cert, initializeApp } from 'firebase-admin/app'

import {
  appProvider,
  databaseProvider,
  // envLoadProvider,
} from './shared/providers'
import { firebaseConfig } from './shared/configs/firebase.config'
;(async () => {
  initializeApp({
    credential: cert(firebaseConfig as any),
  })
  // envLoadProvider.validate()
  await databaseProvider.initialize()
  appProvider.listen()
})()
