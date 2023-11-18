const { mongoose, Schema } = require('mongoose');

const userModel = new Schema({
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
        maxlength: [11, "{VALUE} is longer than 11 digits"],
        unique: [true, "Phone number already exists"],
        required: [true, "Phone Number is required"]
    },
    role: String,
    Auth: {
        token: String
    },
    walletBalance:{
        type:Number,
        default: 0.00
    },
    Profile: {
        displayPicture: String,
        Gender: String,
        Address: String,
        DOB: Date
    }
},{timestamps:true});

const User = mongoose.model('User', userModel, 'Users');
export default User;