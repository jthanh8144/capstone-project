import { hashSync, compareSync } from 'bcryptjs'

const saltRounds = 10

const hashPassword = (password: string) => {
  return hashSync(password, saltRounds)
}

const comparePassword = (password: string, dbPassword: string) => {
  return compareSync(password, dbPassword)
}

export { hashPassword, comparePassword }
