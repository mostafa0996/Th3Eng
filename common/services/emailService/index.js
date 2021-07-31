const logger = require('../../../common/config/logger');
const sgMail = require('@sendgrid/mail');
const config = require('../../config/configuration');
sgMail.setApiKey(config.sendgrid.apikey);

const _sendEmail = async (email, subject, text) => {
  const msg = {
    to: email,
    from: 'eng.ahmedfarag.a@gmail.com',
    subject: subject,
    text: text,
  };

  sgMail.send(msg).then(
    (result) => {
      logger.info(JSON.stringify(result, null, 2));
    },
    (error) => {
      if (error.response) {
        logger.error(JSON.stringify(error.response.body));
        throw new Error(JSON.stringify(error.response.body));
      }
    }
  );
};

const sendVerificationEmail = async (token, name, email) => {
  const subject = 'The Eng Verification';

  // todo: front end make email template that has a clickable button routes to our frontend.
  const text = `Hello ${name},
                Please verify you account through this link
                http://localhost:3000/home/Verification/${token}
                Thanks`;
  return _sendEmail(email, subject, text);
};

const sendPasswordResetEmail = async (token, name, email) => {
  const subject = 'The Eng Password Reset';

  // todo: front end make email template that has a clickable button routes to our frontend.
  const text = `Hello ${name},
                Please reset your password through this link
                http://localhost:3000/home/NewPassword/${token}
                Thanks`;
  return _sendEmail(email, subject, text);
};

const sendHireDeveloperEmail = async (fromEmail, body) => {
  const subject = 'Hire a developer request';
  const text = `Thi request is from ${fromEmail}.
  ${body}
  `;
  return _sendEmail('eng.ahmedfarag.a+1@gmail.com', subject, text);
};

const sendContactUsEmail = async (fromEmail, body, firstName, lastName) => {
  const subject = `Contact us email from ${firstName} ${lastName}` ;
  const text = `Thi request is from ${fromEmail}.
  ${body}
  `;
  return _sendEmail('eng.ahmedfarag.a+1@gmail.com', subject, text);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendHireDeveloperEmail,
  sendContactUsEmail
};
