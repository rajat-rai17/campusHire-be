'use strict'
import { AppConstants } from '../constants'
import { MONGO_MODEL } from './MongoDB';


const createJob = async (header, body) => {
    const { tokenData = { }, ...bodyData } = body
    bodyData.status = true
    const jobId = bodyData.jobId
    const result = await MONGO_MODEL.mongoFindOne('jobs', { jobId, isDeleted:{$exists:false} })
    if(result) {
        return { status: false, message: "Job already exists" }
    }
    await MONGO_MODEL.mongoInsertOne('jobs', bodyData)
    return { status: true, message:"Job created successfully" }
}


const updateJob = async (header, body) => {
    const { tokenData = { }, jobId, ...bodyData } = body
    const query = { jobId, status: true }
    const updateObj = { 
        $set: bodyData
    }
    const result = await MONGO_MODEL.mongoFindOneAndUpdate('jobs', query, updateObj)
    if (result?.lastErrorObject?.updatedExisting) {
        return { status: true, message:"Job updated successfully" }
    }
    return { status: false, message: "Job not found" }
}

const removeJob = async (header, body) => {
    const { tokenData = { }, jobId } = body
    const query = { jobId }
    const updateObj = { 
        $set: {
            status:false,
            isDeleted:true
        }
    }
    const result = await MONGO_MODEL.mongoFindOneAndUpdate('jobs', query, updateObj)
    
    if (!result) {
        return { status: false, message: "Job not found" }
    }
    return { status: true, message:"Job updated successfully" }
}

const listJob = async (header, body) => {
    const { tokenData = { } } = body
    //pagination & filter required
    const query = { status: true }
    const projection  = { jobId:1, title:1, workMode:1, interviewDate:1, deadlineDate:1, location:1, _id:0  }
    let result = await MONGO_MODEL.mongoFind('jobs', query, {projection})

    return { status: true, data : result }
}

export const JobModel = {
    createJob,
    updateJob,
    removeJob,
    listJob
}
