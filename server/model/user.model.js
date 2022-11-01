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
            validator: function (usr) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usr);
            },
            message: "{VALUE} is not a valid email"
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
        minLength: [9,"{VALUE} doesnt seem like a valid number"],
        maxlength: [11, "{VALUE} is longer then 11 digits"],
        unique: [true, "Phone number already exists"],
        required: [true, "Phone Number is required"]
    },
    role: String,
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

module.exports = mongoose.model('Users', userModel);