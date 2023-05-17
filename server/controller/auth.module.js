
const crypto = require("crypto");
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const User = require('../model/user.model')


/**
 * This function signs authentication token for JWT
 * @param {ArrayBuffer | Object } payload
 * @param {String} key 
 * @returns String
 */
const SIGN_AUTH_TOKEN = (payload, key) => {
    return jwt.sign({ payload }, key, { expiresIn: '30m' })
}

/**
 * This function sends email to user
 * @param {String} subject message subject header
 * @param {String | HTMLCollection} msgContent HTML string or plain text
 * @param {String } recepient Receiving email addreess
 */
const proxyMailer = (subject, msgContent, recepient) => {

    const mailer = nodemailer.createTransport({
        host: process.env._SMTP_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env._SMTP_USER,
            pass: process.env._PASSKEY,
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: 'ProxyBet <harek@potterincorporated.com>',
        to: recepient,
        subject, // same output in plain text format
        html: msgContent
    };

    mailer.sendMail(mailOptions, function (error, info) {
        if (error) {
            return 'Confirmation mail not sent'
        } else {
            return 'Mail sent'
        }
    });
}

/**
 * This function generates random Hex bytes for reset token
 * @returns String
 */
const RESET_CODE = () => {
    const randomString = crypto.randomBytes(3).toString("hex").toUpperCase();
    return randomString
}

/**
 * Delete token after 15 minutes of inactivity
 * @param {String} usr Recepient email
 */
const resetTimeout = (usr) => {
    setTimeout(() => {
        User.findOneAndUpdate({ _id: usr },
            {
                Auth: {
                    token: undefined
                }
            })
            .then(user => {
                console.log('reset token deleted')
            })
            .catch(e => { console.log(e.message) })

    }, 900000)
}

module.exports = {
    RESET_CODE,
    SIGN_AUTH_TOKEN,
    proxyMailer,
    resetTimeout
}