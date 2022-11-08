require('dotenv').config()
const crypto = require("crypto");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const User = require('../model/user.model');


const newUser = (req, res) => {
    bcrypt.hash(req.body.password, 3, (err, encryptedPassword) => {
        if (err) {
            res.status(400).json({
                message: err
            })
        }
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: encryptedPassword,
            phone: req.body.phone,
            role: process.env.DEFAULT_ROLE
        });
        newUser.save()
            .then(user => {
                delete user.password

                res.status(201).json({
                    message: "Registration Successful",
                    status: true,
                    token: SIGN_AUTH_TOKEN(user, process.env.ACCESS_TOKEN_SECRET)
                })
                const d = new Date()
                let year = d.getFullYear()
                let mail = `
                <h1 style="text-align:center">Welcome ${user.firstName},</h1>
                <p style="text-align:center">
                Thanks for signing up with ProxyBET, we're so happy to have you
                on board. You are now one step closer to becoming an bet king!<br>
                Your account is Activated!</p>
                
                <div style="text-align:center; margin: 50px 0">
                <a 
                    href="https://proxybet.com/api/user/profile" 
                    target="_blank"
                    style="
                        width: 70%; 
                        padding:15px; 
                        background: #008080;
                        text-decoration: none;
                        text-align:center;
                        border-radius: 5px;
                        margin: 20px;
                        box-shadow: 0 1px 2px #333;
                        font-weight: bold;
                        color: #fff"
                >Click Here to Fund Wallet</a>
                </div>
                <hr>
                 <small>
                    <p>&copy; ${year} <a style="color: #008080; text-decoration: none" href="https://proxybet.com" target="_blank">ProxyBet</a>. All rights reserved.</p>
                </small>
                <p>
                `
                proxyMailer('One step closer to unlimited winning', mail, user.email)
            })
            .catch(e => {
                if (e.name == 'ValidationError') {
                    if (e.errors['email']) {
                        res.status(400).json({
                            message: e.errors['email'].message
                        })
                    }
                    if (e.errors['phone']) {
                        res.status(400).json({
                            message: e.errors['phone'].message
                        })
                    }
                }
                else {
                    res.status(405).json({
                        // message: "ERROR: Email or phone already exists in our "
                        message: e.message
                    })
                }
                // if (e.name = 'MongoServerError') {
                //     if (e.keyValue['email']) {
                //         res.status(405).json({
                //             message: `${e.keyValue.email} already exist`
                //         })
                //     }
                //     if (e.keyValue['phone']) {
                //         res.status(405).json({
                //             message: `${e.keyValue.phone} already exist`
                //         })
                //     }
                // }


            })
    })
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res
 */
const login = (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({ email })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    delete user.password

                    res.status(200).json({
                        message: "Login Successful",
                        token: SIGN_AUTH_TOKEN(user, process.env.ACCESS_TOKEN_SECRET)
                    })
                } else {
                    res.status(406).json({
                        message: "TRY AGAIN: Password Invalid!"
                    })
                }
            }
            else {
                res.status(400).json({
                    message: `ERROR: ${email} does not exist`
                })
            }
        })
}

const userResetCode = async (req, res) => {
    try {
        await User.findOneAndUpdate({ email: req.body.email },
            {"Auth.token": req.body.code})

        res.status(200).json({
            isValid: true,
            message: `An authentication code has been sent to ${req.body.email}`
        })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }


}

/**
 * @param {ArrayBuffer | Object } payload
 * @param {String} key 
 * @returns String
 */
const SIGN_AUTH_TOKEN = (payload, key) => {
    return jwt.sign({ payload }, key, { expiresIn: '7d' })
}

/**
 * Sending email to user
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
            console.log(error);
            res.sendStatus(501)
        } else {
            console.log('Email sent: ' + info.response);
            res.sendStatus(200)
        }
    });
}

const RESET_CODE = () => {
    const randomString = crypto.randomBytes(3).toString("hex").toUpperCase();
    return randomString

}
/** 
 *MIDDLEWARE FUNCTION
 */

// AUTHORIZATION TOKEN
const VERIFY_AUTH_TOKEN = (req, res, next) => {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')
        req.token = bearerToken[1]
        next()
    } else {
        res.sendStatus(403)
    }
}

/**Email authentication middleware */
const VERIFY_EMAIL = (req, res, next) => {

    User.findOne({ email: req.body.email }, { _id: 1 })
        .then(user => {
            if (!user) {
                res.status(400).json({
                    isValid: false,
                    message: `FAILED: ${req.body.email} does not exist`
                })
                return
            }

            // send email to client
            let resetCode = `BET-${RESET_CODE()}`
            let outputHTML = resetCode // some html message
            req.body.code = resetCode

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
                to: req.body.email,
                subject: 'Password Reset', // same output in plain text format
                text: outputHTML
            };

            mailer.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.sendStatus(501)
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            next()
        })
        .catch(e => {
            res.status(500).json({
                message: e.message
            })
        })
}

module.exports = { newUser, login, userResetCode, VERIFY_EMAIL, SIGN_AUTH_TOKEN, VERIFY_AUTH_TOKEN }