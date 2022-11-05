import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from 'bcryptjs';
require('dotenv').config();
var salt = bcrypt.genSaltSync(10);
import HttpError from '../shared/error/app-error';
import { ERROR_CODE } from '../shared/error/errorCodes';
import OtpService from '../services/OtpService';
import { ContextOtpCode } from '../shared/common/stringUtils';


export const USER_TYPES = {
    CONSUMER: "consumer",
    SUPPORT: "support",
};

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4().replace(/\-/g, ""),
    },
    email: {
        type: String,
        unique: true,
        maxLength: 150
    },
    fullName: {
        type: String,
        required: false,
        maxLength: 100,
        default: '',
    },
    userName: {
        type: String,
        unique: true,
        maxLength: 150,
    },
    password: {
        type: String,
        required: true,
        maxLength: 100,
        default: '',
    },
    phoneNumber: {
        type: String,
        required: true,
        maxLength: 11,
        unique: true
    },
    avatar: {
        type: String,
        required: false,
        default: '',
    },
    isActice: {
        type: Boolean,
        required: false,
        default: false,
    },
    isDelete: {
        type: Boolean,
        required: false,
        default: false,
    }
}, {
    timestamps: true,
    collection: "users",
});




let hashUserPassword = (password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }

    })
}

/**
 * @param {Object} data
 * @returns {Object} new user object created
 */
userSchema.statics.createUser = async function(data) {
    try {
        const { email, userName, password, phoneNumber, fullName, avatar, otpCode } = data;
        const checkOtp = await OtpService.validateOTPVMobile(ContextOtpCode.CREATE_USER, phoneNumber, otpCode);
        if (checkOtp) {
            let hashPass = await hashUserPassword(password);
            const user = await this.create({ email, userName, password: hashPass, phoneNumber, fullName, avatar });
            return user;
        }
    } catch (error) {
        throw error;
    }
}

/**
 * @param {String} id, user id
 * @return {Object} User profile object
 */
userSchema.statics.getUserById = async function(id) {
    try {
        const user = await this.findOne({ _id: id });
        if (!user) throw new HttpError.fromObject(ERROR_CODE.USER_NOT_FOUND);
        return user;
    } catch (error) {
        throw error;
    }
}

userSchema.statics.authenticateUser = async function(email, password) {
    try {
        const user = await this.findOne({ email: email });
        console.log("Email: " + email)
        let check = false
        if (user)
            check = bcrypt.compareSync(password, user.password);

        if (!user || !check) throw new HttpError.fromObject(ERROR_CODE.UNAUTHORIZED);

        const userResponse = {
            id: user.id,
            fullName: user.fullName,
            avatar: user.avatar,
            email: user.email,
            userName: user.userName,
            phoneNumber: user.phoneNumber,
        }
        return userResponse;
    } catch (error) {
        throw error;
    }
}

/**
 * @return {Array} List of all users
 */
userSchema.statics.getUsers = async function() {
    try {
        const users = await this.find();
        if (!users)
            throw new HttpError.fromObject(ERROR_CODE.USER_NOT_FOUND);
        return users;
    } catch (error) {
        throw error;
    }
}

/**
 * @param {Array} ids, string of user ids
 * @return {Array of Objects} users list
 */
userSchema.statics.getUserByIds = async function(ids) {
    try {
        const users = await this.find({ _id: { $in: ids } });
        if (!users)
            throw new HttpError.fromObject(ERROR_CODE.USER_NOT_FOUND);
        return users;
    } catch (error) {
        throw error;
    }
}

userSchema.statics.getUserByIndentify = async function(identity) {
    try {
        const users = await this.find({ $or: [{ '_id': identity }, { 'email': identity }, { 'phoneNumber': identity }] });
        if (!users || users.length === 0)
            throw new HttpError.fromObject(ERROR_CODE.USER_NOT_FOUND);
        return users;
    } catch (error) {
        throw error;
    }
}

/**
 * @param {String} id - id of user
 * @return {Object} - details of action performed
 */
userSchema.statics.deleteByUserById = async function(id) {
    try {
        const result = await this.remove({ _id: id });
        return result;
    } catch (error) {
        throw error;
    }
}

userSchema.statics.changePassword = async function(data, id) {
    try {
        const user = await this.getUserById(id)
        let check = bcrypt.compareSync(data.oldPassword, user.password);
        if (!check) throw new HttpError.fromObject(ERROR_CODE.UNAUTHORIZED);
        if (data.oldPassword === data.password)
            throw new HttpError.fromObject('Your password must not same as old password')
        let hashPass = await hashUserPassword(data.password);
        user.password = hashPass;
        user.save()

        return user;
    } catch (error) {
        throw error;
    }
}


userSchema.statics.resetPassword = async function(data) {
    try {
        const { identity, otpCode, password } = data;
        const user = await this.getUserByIndentify(identity)
        const checkOtp = await OtpService.validateOTPVMobile(ContextOtpCode.RESET_PASSWORD, identity, otpCode);
        if (checkOtp) {
            let hashPass = await hashUserPassword(password);
            user.password = hashPass;
            user.save()
            return user;
        }
    } catch (error) {
        throw error;
    }
}

// userSchema.statics = {
//     valueExists(query) {
//         return this.findOne(query).then(result => result);
//     }
// };



export default mongoose.model("User", userSchema);