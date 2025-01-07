'use strict'
import { AppConstants } from '../constants'
import { MONGO_MODEL } from './MongoDB';


const createCompany = async (header, body) => {
    const { tokenData = { }, ...bodyData } = body
    bodyData.status = true
    const CompanyId = bodyData.CompanyId
    const result = await MONGO_MODEL.mongoFindOne("Companys", { CompanyId, isDeleted:{$exists:false} })
    if(result) {
        return { status: false, message: "Company already exists" }
    }
    await MONGO_MODEL.mongoInsertOne('Companys', bodyData)
    return { status: true, message:"Company created successfully" }
}


const updateCompany = async (header, body) => {
    const { tokenData = { }, CompanyId, ...bodyData } = body
    const query = { CompanyId, status: true }
    const updateObj = { 
        $set: bodyData
    }
    const result = await MONGO_MODEL.mongoFindOneAndUpdate('Companys', query, updateObj)
    console.log("🚀 ~ removeCompany ~ result:", result)
    if (result?.lastErrorObject?.updatedExisting) {
        return { status: true, message:"Company updated successfully" }
    }
    return { status: false, message: "Company not found" }
}

const removeCompany = async (header, body) => {
    const { tokenData = { }, CompanyId } = body
    const query = { CompanyId }
    const updateObj = { 
        $set: {
            status:false,
            isDeleted:true
        }
    }
    console.log("🚀 ~ removeCompany ~ query:", query)
    const result = await MONGO_MODEL.mongoFindOneAndUpdate('Companys', query, updateObj)
    
    if (!result) {
        return { status: false, message: "Company not found" }
    }
    return { status: true, message:"Company updated successfully" }
}

const listCompany = async (header, body) => {
    const { tokenData = { } } = body
    //pagination & filter required
    const query = { status: true }
    const projection  = { CompanyId:1, name:1, email:1, mobileNo:1, location:1, _id:0  }
    let result = await MONGO_MODEL.mongoFind('Companys', query, {projection})

    return { status: true, data : result }
}

export const CompanyModel = {
    createCompany,
    updateCompany,
    removeCompany,
    listCompany
}
