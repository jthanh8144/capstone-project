import { SendMailOptions } from 'nodemailer'
import { environment } from '../../shared/constants'
import { addMailJob } from './worker'

export const sendVerifyEmail = (email: string, verifyId: string) => {
  const verifyLink = `${environment.host}/auth/verify?id=${verifyId}`
  const data: SendMailOptions = {
    to: email,
    from: environment.mail.user,
    subject: 'Email confirmation',
    text: `Please visit my website through link ${verifyLink} to verify your email.`,
    html: `Press <a href="${verifyLink}" style="color: red">HERE</a> to verify your email.`,
  }
  return addMailJob({ data })
}

export const sendVerifyCode = (email: string, code: string) => {
  const data: SendMailOptions = {
    to: email,
    from: environment.mail.user,
    subject: 'Verify code in Safe Talk',
    text: `Your verify code is ${code}`,
    html: `Your verify code is <span style="color: red; font-size: 20px">${code}</span>.`,
  }
  return addMailJob({ data })
}

export const sendResetPassword = (email: string, password: string) => {
  const data: SendMailOptions = {
    to: email,
    from: environment.mail.user,
    subject: 'Reset password in Safe Talk',
    text: `Your new password is ${password}`,
    html: `Your new password is <span style="color: red; font-size: 20px">${password}</span>.`,
  }
  return addMailJob({ data })
}
