import mongoose, { Schema } from "mongoose";
import { systemRoles, providers } from '../../src/utils/systemRoles.js'

const userSchema = new Schema({
    Name: {
        type: String,
        required: true,
        unique:true,
        min: 3,
        max: 20,
        trim: true
    },
    Mail: {
        type: String,
        required: true,
        unique: true,
    },
    Phone:{
        type: String,
        required: true,
        min: 11,
        max: 11,
        trim: true
    },
    Age:{
        type: String,
        required: true,
        trim: true
     },
     NationalID:{
        type: String,
        required: true,
        unique:true,
        min: 14,
        max: 14,
        trim: true
     },
    Password: {
        type: String,
        required: true,
    },
    profilePic: {
        secure_url: String,
        public_id: String,
    },
    role: {
        type: String,
        enum: [systemRoles.CLIENT],
        default: systemRoles.CLIENT
    },
    provider: {
        type: String,
        enum: [providers.SYSTEM, providers.GOOGLE, providers.FACEBOOK],
        required: true,
        default: providers.SYSTEM
    },
    token: {
        type: String,
        default: ''
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    otp: String,

}, {
    timestamps: true
})

export const userModel = mongoose.model('user', userSchema)