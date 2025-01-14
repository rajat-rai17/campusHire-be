'use strict'
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
    if (result?.lastErrorObject?.updatedExisting) {
        return { status: true, message:"Company updated successfully" }
    }
    return { status: false, message: "Company not found" }
}

const removeCompany = async (header, body) => {
    const { tokenData = { }, companyId } = body
    const query = { companyId }
    const updateObj = { 
        $set: {
            status:false,
            isDeleted:true
        }
    }
    const result = await MONGO_MODEL.mongoFindOneAndUpdate('company', query, updateObj)
    
    if (!result) {
        return { status: false, message: "Company not found" }
    }
    return { status: true, message:"Company updated successfully" }
}

const listCompany = async (header, body) => {
    const { tokenData = { } } = body
    //pagination & filter required
    const query = { status: true }
    const projection  = { companyId:1, name:1, email:1, mobileNo:1, location:1, _id:0  }
    let result = await MONGO_MODEL.mongoFind('company', query, {projection})

    return { status: true, data : result }
}

export const CompanyModel = {
    createCompany,
    updateCompany,
    removeCompany,
    listCompany
}
