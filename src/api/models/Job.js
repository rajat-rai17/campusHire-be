'use strict'
import { AppConstants } from '../constants'
import { MONGO_MODEL } from './MongoDB';


const createJob = async (header, body) => {
    const { tokenData = { }, ...bodyData } = body
    bodyData.status = true
    if(bodyData.companies){
        bodyData.companyName = bodyData.companies.text
        bodyData.companyId = bodyData.companies.value
        delete bodyData.companies
    }

    if(bodyData.programs){
        bodyData.programId = bodyData.programs.value
        bodyData.programName = bodyData.programs.text
        delete bodyData.programs
    }
    const jobId= await MONGO_MODEL.mongoFindOneAndUpdate('counter', { jobIdSeq: {$exists:true} }, { $inc: { jobIdSeq: 1 } })
    bodyData.jobId = jobId.value.jobIdSeq
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
    const query = { jobId : +jobId,}
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
    const { tokenData = { }, search, pagination  } = body
    let { perPage = 10, page = 1 } = pagination
    const query = { status: true }
    if(search) {
        query.$or = [
            { jobId: { $regex: search, $options: 'i' } },
            { title: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
            { companyName: { $regex: search, $options: 'i' } },
            { type: { $regex: search, $options: 'i' } },
        ]
    }
    page = page - 1 
    const limit = perPage
    const skip = perPage * page
    const projection  = { jobId:1, title:1, type:1, interviewDate:1, location:1, locationType:1,programName:1,companyName:1, programId:1, companyId:1 } 
    let result = await MONGO_MODEL.mongoFind('jobs', query, {projection, sort: { _id: -1 }, limit, skip})
    let totalRecords = await MONGO_MODEL.mongoCountDocuments('jobs', query)
    if(!totalRecords) totalRecords = 0
    return { status: true, data : result, totalRecords }
}


const masterData = async (header, body) => {
    const { tokenData = {}, ...bodyData } = body;
    const dataRequired = bodyData.dataRequired || [];

    const queryMap = {
        programData: {
            collection: "program",
            filter: {},
            projection: { programId: 1, name: 1, _id: 0 }
        },
        companyData: {
            collection: "company",
            filter: { status: true },
            projection: { companyId: 1, name: 1, _id: 0 }
        }
    };

    // Generate queries dynamically
    const queries = dataRequired
        .filter((key) => queryMap[key]) // Ensure only valid keys are used
        .map(async (key) => {
            try {
                const data = await MONGO_MODEL.mongoFind(
                    queryMap[key].collection,
                    queryMap[key].filter,
                    { projection: queryMap[key].projection }
                );
                return { key, status: "fulfilled", value: data };
            } catch (error) {
                return { key, status: "rejected", reason: error.message };
            }
        });

    // Execute queries in parallel
    const resultsArray = await Promise.allSettled(queries);

    // Transform results into a structured response
    const result = {};
    resultsArray.forEach(({ status, value, reason }) => {
        if (status === "fulfilled") {
            result[value.key] = value.value;
        } else {
            console.error(`Query failed for ${value.key}: ${reason}`);
        }
    });

    return result;
};




export const JobModel = {
    createJob,
    updateJob,
    removeJob,
    listJob,
    masterData
}
