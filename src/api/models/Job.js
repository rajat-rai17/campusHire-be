'use strict'
import { AppConstants } from '../constants'
import { MONGO_MODEL } from './MongoDB';


const createJob = async (header, body) => {
    const { tokenData = { }, ...bodyData } = body
    bodyData.status = true
    const JobId = bodyData.JobId
    const result = await MONGO_MODEL.mongoFindOne("Jobs", { JobId, isDeleted:{$exists:false} })
    if(result) {
        return { status: false, message: "Job already exists" }
    }
    await MONGO_MODEL.mongoInsertOne('Jobs', bodyData)
    return { status: true, message:"Job created successfully" }
}


const updateJob = async (header, body) => {
    const { tokenData = { }, JobId, ...bodyData } = body
    const query = { JobId, status: true }
    const updateObj = { 
        $set: bodyData
    }
    const result = await MONGO_MODEL.mongoFindOneAndUpdate('Jobs', query, updateObj)
    console.log("🚀 ~ removeJob ~ result:", result)
    if (result?.lastErrorObject?.updatedExisting) {
        return { status: true, message:"Job updated successfully" }
    }
    return { status: false, message: "Job not found" }
}

const removeJob = async (header, body) => {
    const { tokenData = { }, JobId } = body
    const query = { JobId }
    const updateObj = { 
        $set: {
            status:false,
            isDeleted:true
        }
    }
    console.log("🚀 ~ removeJob ~ query:", query)
    const result = await MONGO_MODEL.mongoFindOneAndUpdate('Jobs', query, updateObj)
    
    if (!result) {
        return { status: false, message: "Job not found" }
    }
    return { status: true, message:"Job updated successfully" }
}

const listJob = async (header, body) => {
    const { tokenData = { } } = body
    //pagination & filter required
    const query = { status: true }
    const projection  = { JobId:1, title:1, workMode:1, interviewDate:1, deadlineDate:1, location:1, _id:0  }
    let result = await MONGO_MODEL.mongoFind('Jobs', query, {projection})

    return { status: true, data : result }
}

export const JobModel = {
    createJob,
    updateJob,
    removeJob,
    listJob
}
