const { mongoose } = require('../config');

const UserSchema = mongoose.Schema;

const userModel = new UserSchema({
    firstName: {
        type: String,
        required: [true, "First Name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: usr => {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usr);
            },
            message: `${usr} is not a valid email`
        },
        unique: [true, "Email already exits!"],
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    phone: {
        type: String,
        maxlength: 11,
        unique: true,
        required: [true, "Phone Number is required"]
    },
    role: {
        type: String,
        required: true
    },
    dateRegistered: {
        type: Date,
        default: Date.now,
    },
    Auth: {
        token: {
            type: String,
            exp: Date,
        }
    },
    Profile: {
        displayPicture: String,
        Gender: String,
        Address: String,
        DOB: Date
    }
});

module.exports = mongoose.model('User', userModel, 'Users');