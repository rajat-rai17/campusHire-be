'use strict'
import jwt from 'jsonwebtoken';
import { AppConstants } from '../constants'
import { MONGO_MODEL } from './MongoDB';


const createOTP = async (headers) => {
    const { email } = headers

    const result = await MONGO_MODEL.mongoFindOne('users', { email, status: true })
    if (!result) return { status: false, message: 'Invalid User' }

    const OTP = Math.floor(1000 + Math.random() * 9000);
    //Need to add code for sending OTP email
    const oid = `${Math.random().toString(36).substr(2, 12)}-${email}`
    await MONGO_MODEL.mongoInsertOne('otp', { oid, otp: OTP }) //OTP collection is TTL indexed for 5 minutes
    return { status: true, message: 'OTP Sent Successfully', oid }
}

const verifyOTP = async (headers) => {

    const { oid, otp } = headers

    const email = oid.split('-')[1]
    let query = { email, status: true }
    const projection = { email: 1, mobileNo: 1, userId: 1, name: 1, type: 1, _id: 0 }
    const userData = await MONGO_MODEL.mongoFindOne('users', query, { projection })
    if (!userData) return { status: false, message: 'Invalid OTP' }

    query = { oid, otp: +otp }
    const result = await MONGO_MODEL.mongoFindOne('otp', query)

    if (result) {
        const tokenData = userData
        const token = jwt.sign(tokenData, AppConstants.jwtSecret, { expiresIn: '365d' });
        MONGO_MODEL.mongoDeleteOneDocument('otp', { oid })
        return { status: true, message: 'Login Successfully', token, userData }
    }
    else return { status: false, message: 'Invalid OTP' }

}

const resendOTP = async (headers) => {
    const { oid } = headers
    const email = oid.split('-')[1]

    const result = await MONGO_MODEL.mongoFindOne('users', { email, status: true })
    if (!result) return { status: false, message: 'Invalid User' }

    const otp = Math.floor(1000 + Math.random() * 9000);
    //Need to add code for sending OTP email
    
    const otpResult = await MONGO_MODEL.mongoUpdateOne('otp', { oid }, { $set: { otp, updatedAt: new Date() } }) //OTP collection is TTL indexed for 10 minutes
    if (otpResult.matchedCount === 0) return { status: false, message: 'OTP Expired' }
    return { status: true, message: 'OTP Sent Successfully' }
}


export const OTPModel = {
    createOTP,
    verifyOTP,
    resendOTP
}
