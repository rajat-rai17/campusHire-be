'use strict'
import jwt from 'jsonwebtoken';
import { AppConstants } from '../constants'
import { MONGO_MODEL } from './MongoDB';



import randomstring from 'randomstring';

const verifyUser = async (body) => {

    const { email, password } = body

    let query = { email, password, status: true }
    const projection = { email: 1, mobileNo: 1, userId: 1, name: 1, type: 1, resumeFile: 1, _id: 0 }
    const userData = await MONGO_MODEL.mongoFindOne('users', query, { projection })
    if (!userData) return { status: false, message: 'Invalid Credentials' }

    const tokenData = userData
    const token = jwt.sign(tokenData, AppConstants.jwtSecret, { expiresIn: '365d' });
    return { status: true, message: 'Login Successfully', token, userData }

}

import crypto from 'crypto';
import nodemailer from 'nodemailer';

const forgotPassword = async (body) => {
    const { email } = body;

    let query = { email, status: true };
    const projection = { email: 1, _id: 1 };
    const userData = await MONGO_MODEL.mongoFindOne('users', query, { projection });
    
    if (!userData) {
        return { status: false, statusCode: 404, message: 'Email address not found' };
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = Date.now() + 3600000; // 1 hour

    // Save token to DB
    await MONGO_MODEL.mongoUpdateOne('users', query, { 
        $set: { 
            resetPasswordToken: resetToken, 
            resetPasswordExpires: resetPasswordExpires 
        }
    });

    // Use real Gmail SMTP
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5176';
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: process.env.SMTP_USER || '"Campus Hire" <noreply@campushire.com>',
        to: email,
        subject: 'Password Reset - Campus Hire',
        html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
               <p>Please click on the following link to complete the process:</p>
               <p><a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
               <p>Or paste this into your browser: <br> <a href="${resetUrl}">${resetUrl}</a></p>
               <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        
        return { 
            status: true, 
            message: 'Reset link has been sent to your email.'
        };
    } catch (error) {
        console.error("Email send error:", error);
        return {
            status: false,
            statusCode: 500,
            message: 'Error from Google: ' + error.message + ' (You must use a 16-letter App Password in your .env file, normal passwords are blocked by Google!)'
        }
    }
}

const resetPassword = async (body) => {
    console.log("Reset Password Body:", body);
    const { token, newPassword } = body;

    if (!token || !newPassword) {
        return { status: false, statusCode: 400, message: 'Token and new password are required' };
    }

    let query = { 
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
        status: true 
    };
    const userData = await MONGO_MODEL.mongoFindOne('users', query, { projection: { email: 1 } });

    if (!userData) {
        return { status: false, statusCode: 400, message: 'Password reset token is invalid or has expired.' };
    }

    // Update password and remove token fields
    const updateResult = await MONGO_MODEL.mongoUpdateOne('users', { _id: userData._id }, { 
        $set: { password: newPassword },
        $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 }
    });
    console.log("Password Reset Update Result:", updateResult);

    return { status: true, message: 'Password has been successfully updated.' };
}

export const AuthModel = {
    verifyUser,
    forgotPassword,
    resetPassword
}
