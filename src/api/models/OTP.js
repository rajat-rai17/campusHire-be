'use strict'


const createOTP = async (headers) => {
    const { email } = headers
    // Generate OTP
    const OTP = 1234
    // Send OTP to email
    return { status: true, message: 'OTP Sent Successfully', OTP }
}

// OTP Model Functions being exposed
export const OTPModel = {
    createOTP
}
