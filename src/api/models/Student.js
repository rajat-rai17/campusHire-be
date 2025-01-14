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
    const query = { studentId }
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
    const { tokenData = { } } = body
    //pagination & filter required
    const query = { status: true }
    const projection  = { studentId:1, name:1, email:1, mobileNo:1, program:1, _id:0 }
    let result = await MONGO_MODEL.mongoFind('students', query, {projection})

    return { status: true, data : result }
}

export const StudentModel = {
    createStudent,
    updateStudent,
    removeStudent,
    listStudent
}
