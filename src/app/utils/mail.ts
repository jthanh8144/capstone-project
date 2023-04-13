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
