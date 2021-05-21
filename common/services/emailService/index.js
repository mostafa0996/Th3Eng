const logger = require('../../../common/config/logger');
const sgMail = require('@sendgrid/mail');
const config = require('../../config/configuration');
sgMail.setApiKey(config.sendgrid.apikey);

const _sendEmail = async (email, subject, text) => {
  const msg = {
    to: email,
    from: 'mostafakhalid0996@gmail.com',
    subject: subject,
    text: text,
  };
  
  sgMail.send(msg).then(() => {}, error => {
    console.log(error);
    logger.error(error);
    if (error.response) {
      logger.error(error.response.body);
      throw new Error(error.response.body);
    }
  });
};

const sendVerificationEmail = async (token, name, email) => {
  const subject = 'VoyShip Verification';
  
  // todo: front end make email template that has a clickable button routes to our frontend.
  const text = `Hello ${name},
                Please verify you account through this link
                ${token}
                Thanks`;
  return _sendEmail(email, subject, text)
};

const sendPasswordResetEmail = async (token, name, email) => {
  const subject = 'VoyShip Password Reset';
  
  // todo: front end make email template that has a clickable button routes to our frontend.
  const text = `Hello ${name},
                Please reset your password through this link
                ${token}
                Thanks`;
  return _sendEmail(email, subject, text)
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
};