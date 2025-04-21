'use strict'
import jwt from 'jsonwebtoken';
import { AppConstants } from '../constants'
import { MONGO_MODEL } from './MongoDB';



const verifyUser = async (body) => {

    const { email, password } = body

    let query = { email, password, status: true }
    const projection = { email: 1, mobileNo: 1, userId: 1, name: 1, type: 1, _id: 0 }
    const userData = await MONGO_MODEL.mongoFindOne('users', query, { projection })
    if (!userData) return { status: false, message: 'Invalid OTP' }

    const tokenData = userData
    const token = jwt.sign(tokenData, AppConstants.jwtSecret, { expiresIn: '365d' });
    return { status: true, message: 'Login Successfully', token, userData }

}



export const AuthModel = {
    verifyUser
}
