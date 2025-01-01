'use strict'
import jwt from 'jsonwebtoken';
import { AppConstants } from '../constants'
import { MONGO_MODEL } from './MongoDB';


const createOTP = async (headers) => {
    const { email } = headers
    const OTP =  Math.floor(1000 + Math.random() * 9000);
    //Need to add code for email
    const oid = `${Math.random().toString(36).substr(2, 12)}-${email}`
    await MONGO_MODEL.mongoInsertOne('otp', { oid, otp: OTP })
    return { status: true, message: 'OTP Sent Successfully', oid }
}

const verifyOTP = async (headers) => {

    const { oid, otp } = headers

    const email = oid.split('-')[1]
    const query = { oid, otp: +otp }
    const result = await MONGO_MODEL.mongoFindOne('otp', query)

    //Need to add code for Email verfiication and OTP verification
    if(result){
        const token = jwt.sign({ email }, AppConstants.jwtSecret, { expiresIn: '365d' });

        return { status: true, message: 'Login Successfully', token }
    }
    else return { status: false, message: 'Invalid OTP' }

}

const resendOTP = async (headers) => {
    const { oid } = headers
    const email = oid.split('-')[1]
    //Need to add code for email
    return { status: true, message: 'OTP Sent Successfully' }
}


export const OTPModel = {
    createOTP,
    verifyOTP,
    resendOTP
}
