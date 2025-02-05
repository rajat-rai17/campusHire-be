'use strict'
import { AppConstants } from '../constants'
import { MONGO_MODEL } from './MongoDB';


const createStudent = async (header, body) => {
    const { tokenData = { }, ...bodyData } = body
    bodyData.status = true
    const studentId = bodyData.studentId
    const result = await MONGO_MODEL.mongoFindOne("students", { studentId, isDeleted:{$exists:false} })
    if(result) {
        return { status: false, message: "Student already exists" }
    }
    await MONGO_MODEL.mongoInsertOne('students', bodyData)
    return { status: true, message:"Student created successfully" }
}


const updateStudent = async (header, body) => {
    const { tokenData = { }, studentId, ...bodyData } = body
    const query = { studentId, status: true }
    const updateObj = { 
        $set: bodyData
    }
    const result = await MONGO_MODEL.mongoFindOneAndUpdate('students', query, updateObj)
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
    const result = await MONGO_MODEL.mongoFindOneAndUpdate('students', query, updateObj)
    
    if (!result) {
        return { status: false, message: "Student not found" }
    }
    return { status: true, message:"Student updated successfully" }
}

const listStudent = async (header, body) => {
    const { tokenData = { }, search, pagination  } = body
    let { perPage = 10, page = 1 } = pagination
    //pagination required
    const query = { status: true }
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
    let result = await MONGO_MODEL.mongoFind('students', query, {projection, sort: { _id: -1 }, limit, skip })
    let totalRecords = await MONGO_MODEL.mongoCountDocuments('students', query)
    if(!totalRecords) totalRecords = 0
    return { status: true, data : result, totalRecords }
}

export const StudentModel = {
    createStudent,
    updateStudent,
    removeStudent,
    listStudent
}
