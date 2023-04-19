import { SendMailOptions } from 'nodemailer'
import mailService from '../../shared/configs/mail-service.config'

export const sendVerifyEmail = (email: string, verifyId: string) => {
  const verifyLink = `${process.env.APP_HOST}/auth/verify?id=${verifyId}`
  const msg: SendMailOptions = {
    to: email,
    from: process.env.MAIL_USER,
    subject: 'Email confirmation',
    text: `Please visit my website through link ${verifyLink} to verify your email.`,
    html: `Press <a href="${verifyLink}" style="color: red">HERE</a> to verify your email.`,
  }
  return mailService.sendMail(msg)
}

export const sendVerifyCode = (email: string, code: string) => {
  const msg: SendMailOptions = {
    to: email,
    from: process.env.MAIL_USER,
    subject: 'Verify code in Safe Talk',
    text: `Your verify code is ${code}`,
    html: `Your verify code is <span style="color: red; font-size: 20px">${code}</span>.`,
  }
  return mailService.sendMail(msg)
}

export const sendResetPassword = (email: string, password: string) => {
  const msg: SendMailOptions = {
    to: email,
    from: process.env.MAIL_USER,
    subject: 'Reset password in Safe Talk',
    text: `Your new password is ${password}`,
    html: `Your new password is <span style="color: red; font-size: 20px">${password}</span>.`,
  }
  return mailService.sendMail(msg)
}
