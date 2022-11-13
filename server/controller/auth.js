require('dotenv').config()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { proxyMailer, SIGN_AUTH_TOKEN, RESET_CODE, resetTimeout } = require("./auth.module");

const User = require('../model/user.model');

// User registration
const newUser = (req, res) => {
    bcrypt.hash(req.body.password, 3, (err, encryptedPassword) => {
        if (err) {
            res.status(400).json({
                message: err
            })
        }
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: encryptedPassword,
            phone: req.body.phone,
            role: process.env.DEFAULT_ROLE
        });
        user.save()
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

//User login
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

// Email reset code
const userResetCode = async (req, res) => {
    try {
        await User.findOneAndUpdate({ _id: req.id },
            {
                Auth: {
                    token: req.code
                }
            })

        res.status(200).json({
            isValid: true,
            message: `An authentication code has been sent to ${req.body.email}`
        })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }

    // Delete reset token after 15 minutes
    resetTimeout(req.id)
}

// Update new password
const updateNewPassword = async (req, res) => {
    try {
        await User.findOneAndUpdate({ _id: req.params.id },
            {
                password: bcrypt.hashSync(req.body.password, 3)
            })
        res.status(201).json({
            message: "Password Changed"
        })
        resetTimeout(req.params.id)
    } catch (e) {
        res.status(400).json({
            message: `Error: ${e.message}`
        })
    }
}

/** 
 *MIDDLEWARE FUNCTION
 */

// AUTHORIZATION TOKEN
const VERIFY_AUTH_TOKEN = (req, res, next) => {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1]

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            req.bearer = user
            next()
        });
    } else {
        res.sendStatus(403)
    }
}

/**Email authentication */
const VERIFY_EMAIL = (req, res, next) => {

    User.findOne({ email: req.body.email }, { _id: 1, firstName: 1 })
        .then(user => {
            if (!user) {
                res.status(400).json({
                    isValid: false,
                    message: `FAILED: ${req.body.email} does not exist`
                })
                return
            }

            let resetCode = `BET-${RESET_CODE()}`
            const d = new Date()
            let year = d.getFullYear()
            req.code = resetCode
            req.id = user._id

            let content = `
            <p style="margin-bottom: 1rem"><strong>Dear ${user.firstName},</strong></p>
            <p style="margin-bottom: 2rem">
                <strong>Please enter the following code 
                    <span 
                        style="font-size: 1.5rem;
                        color:#008080">${resetCode}
                        </span> to verify your account.
                    </strong>
                </p>

            <small>
                <p style="margin-bottom:10px">Please pay attention:</p>
                <ul>
                    <li>After verification, you will be able to modify your password</li>
                    <li>If you did not apply for a verification code,<br>
                        please sign in to your account and change your password to ensure your account's security.</li>
                    <li>In order to protect your account, please do not allow others access to your email.</li>
                </ul>
                <hr>
                <p>&copy; ${year} <a style="color: #008080; text-decoration: none" href="https://proxybet.com" target="_blank">ProxyBet</a>. All rights reserved.</p>
                </small>`

            // send email to client
            proxyMailer("Password Reset", content, req.body.email)
            next()
        })
        .catch(e => {
            res.status(504).json({
                message: e.message
            })
        })
}

module.exports = {
    newUser,
    login,
    userResetCode,
    updateNewPassword,
    VERIFY_EMAIL,
    SIGN_AUTH_TOKEN,
    VERIFY_AUTH_TOKEN
}