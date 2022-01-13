import nodemailer from 'nodemailer';

export default class Mailer {

  /**
   * 
   * @param {Object} param
   * to: Email list as string separate by comma
   * body: Mailbody
   * html: boolean for set body as HTML or not
   */
  static async sendMail({ to, subject, body }) {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_EMAIL, // generated ethereal user
        pass: process.env.MAIL_PASSWORD, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.MAIL_EMAIL, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: body, // plain text body
      html: body, // html body
    });

    console.log('Message sent: %s', info.messageId);
  }

}