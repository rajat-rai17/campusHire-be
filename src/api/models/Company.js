'use strict'
import { type } from 'os';
import { AppConstants } from '../constants'
import { MONGO_MODEL } from './MongoDB';


const createCompany = async (header, body) => {
    const { tokenData = { }, ...bodyData } = body
    bodyData.status = true
    const companyId = bodyData.companyId
    const result = await MONGO_MODEL.mongoFindOne("company", { companyId, isDeleted:{$exists:false} })
    if(result) {
        return { status: false, message: "Company already exists" }
    }
    await MONGO_MODEL.mongoInsertOne('company', bodyData)
    return { status: true, message:"Company created successfully" }
}


const updateCompany = async (header, body) => {
    const { tokenData = { }, companyId, ...bodyData } = body
    const query = { companyId, status: true }
    const updateObj = { 
        $set: bodyData
    }
    const result = await MONGO_MODEL.mongoFindOneAndUpdate('company', query, updateObj)
    console.log("🚀 ~ removeCompany ~ result:", result)
    if (result?.lastErrorObject?.updatedExisting) {
        return { status: true, message:"Company updated successfully" }
    }
    return { status: false, message: "Company not found" }
}

const removeCompany = async (header, body) => {
    const { tokenData = { }, companyId } = body
    const query = { companyId: +companyId }
    const updateObj = { 
        $set: {
            status:false,
            isDeleted:true
        }
    }
    console.log("🚀 ~ removeCompany ~ query:", query)
    const result = await MONGO_MODEL.mongoFindOneAndUpdate('company', query, updateObj)
    
    if (!result) {
        return { status: false, message: "Company not found" }
    }
    return { status: true, message:"Company updated successfully" }
}

const listCompany = async (header, body) => {
    const { tokenData = { }, search, pagination  } = body
    let { perPage = 10, page = 1 } = pagination
    //pagination required
    const query = { status: true }
    if(search) {
        query.$or = [
            { companyIdId: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { mobileNo: { $regex: search, $options: 'i' } },
            { type: { $regex: search, $options: 'i' } },
        ]
    }
    
    //pagination
    page = page - 1 
    const limit = perPage
    const skip = perPage * page

    const projection  = { companyId:1, name:1, email:1, mobileNo:1, type:1, _id:0 }
    let result = await MONGO_MODEL.mongoFind('company', query, {projection, sort: { _id: -1 }, limit, skip })
    let totalRecords = await MONGO_MODEL.mongoCountDocuments('company', query)
    if(!totalRecords) totalRecords = 0
    return { status: true, data : result, totalRecords }
}

export const CompanyModel = {
    createCompany,
    updateCompany,
    removeCompany,
    listCompany
}
