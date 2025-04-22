'use strict'
import { AppConstants } from '../constants'
import { MONGO_MODEL } from './MongoDB';


const createStudent = async (header, body) => {
    let { tokenData = { }, ...bodyData } = body
    bodyData.status = true
    const studentId = bodyData.studentId
    const result = await MONGO_MODEL.mongoFindOne("students", { studentId, isDeleted:{$exists:false} })
    if(result) {
        return { status: false, message: "Student already exists" }
    }

    const userId = await MONGO_MODEL.mongoFindOneAndUpdate('counter', { userIdSeq: {$exists:true} }, { $inc: { userIdSeq: 1 } })
    bodyData.userId = userId.value.userIdSeq
    bodyData = {
        ...bodyData,
        type:'student',
        password: 'pass@123' //Math.random().toString(36).substring(2, 12)
    }
    await MONGO_MODEL.mongoInsertOne('users', bodyData)
    return { status: true, message:"Student created successfully" }
}


const updateStudent = async (header, body) => {
    const { tokenData = { }, studentId, ...bodyData } = body
    const query = { studentId, status: true }
    const updateObj = { 
        $set: bodyData
    }
    const result = await MONGO_MODEL.mongoFindOneAndUpdate('users', query, updateObj)
    if (result?.lastErrorObject?.updatedExisting) {
        return { status: true, message:"Student updated successfully" }
    }
    return { status: false, message: "Student not found" }
}

const removeStudent = async (header, body) => {
    const { tokenData = { }, studentId } = body
    const query = { studentId: +studentId }
    const updateObj = { 
        $set: {
            status:false,
            isDeleted:true
        }
    }
    const result = await MONGO_MODEL.mongoFindOneAndUpdate('users', query, updateObj)
    
    if (!result) {
        return { status: false, message: "Student not found" }
    }
    return { status: true, message:"Student updated successfully" }
}

const listStudent = async (header, body) => {
    const { tokenData = { }, search, pagination  } = body
    let { perPage = 10, page = 1 } = pagination
    //pagination required
    const query = { status: true, type:'student' }
    if(search) {
        query.$or = [
            { studentId: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { mobileNo: { $regex: search, $options: 'i' } },
            { program: { $regex: search, $options: 'i' } },
        ]
    }
    
    //pagination
    page = page - 1 
    const limit = perPage
    const skip = perPage * page


    const projection  = { studentId:1, name:1, email:1, mobileNo:1, program:1, _id:0 }
    let result = await MONGO_MODEL.mongoFind('users', query, {projection, sort: { _id: -1 }, limit, skip })
    let totalRecords = await MONGO_MODEL.mongoCountDocuments('users', query)
    if(!totalRecords) totalRecords = 0
    return { status: true, data : result, totalRecords }
}


const uploadResume = async (tokenData, fileName) => {
    const { userId } = tokenData
    const query = { userId }
    const updateObj = { 
        $set: {
            resumeFile: fileName
        }
    }
    const result = await MONGO_MODEL.mongoFindOneAndUpdate('users', query, updateObj)
    if (result?.lastErrorObject?.updatedExisting) {
        return { status: true, message:"Resume uploaded successfully" }
    }
    return { status: false, message: "Resume not uploaded" }
}

export const StudentModel = {
    createStudent,
    updateStudent,
    removeStudent,
    listStudent,
    uploadResume
}
