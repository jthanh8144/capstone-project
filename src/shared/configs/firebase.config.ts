import { environment } from '../constants'

export const firebaseConfig = {
  type: 'service_account',
  ['project_id']: environment.firebase.projectId,
  ['private_key_id']: environment.firebase.privateKeyId,
  ['private_key']: environment.firebase.privateKey,
  ['client_email']: environment.firebase.clientEmail,
  ['client_id']: environment.firebase.clientId,
  ['auth_uri']: 'https://accounts.google.com/o/oauth2/auth',
  ['token_uri']: 'https://oauth2.googleapis.com/token',
  ['auth_provider_x509_cert_url']: 'https://www.googleapis.com/oauth2/v1/certs',
  ['client_x509_cert_url']: environment.firebase.clientCertUrl,
  ['universe_domain']: 'googleapis.com',
}
