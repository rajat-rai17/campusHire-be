'use strict'
import { AppConstants } from '../constants'
import { MONGO_MODEL } from './MongoDB'

const createNotice = async (header, body) => {
  const { tokenData = { }, ...bodyData } = body
  bodyData.status = true
  if(bodyData.programs){
      bodyData.programId = bodyData.programs.value
      bodyData.programName = bodyData.programs.text
      delete bodyData.programs
  }
  const noticeId= await MONGO_MODEL.mongoFindOneAndUpdate('counter', { noticeIdSeq: {$exists:true} }, { $inc: { noticeIdSeq: 1 } })
  bodyData.noticeId = noticeId.value.noticeIdSeq
  const result = await MONGO_MODEL.mongoFindOne('notice', { noticeId, isDeleted:{$exists:false} })
  if(result) {
      return { status: false, message: "Notice already exists" }
  }
  await MONGO_MODEL.mongoInsertOne('notice', bodyData)
  return { status: true, message:"Notice created successfully" }
}

const updateNotice = async (header, body) => {
  const { tokenData = {}, noticeId, ...bodyData } = body
  const query = { noticeId, status: true }
  const updateObj = { $set: bodyData }

  const result = await MONGO_MODEL.mongoFindOneAndUpdate('notice', query, updateObj)

  if (result?.lastErrorObject?.updatedExisting) {
    return { status: true, message: 'Notice updated successfully' }
  }
  return { status: false, message: 'Notice not found' }
}

const removeNotice = async (header, body) => {
  const { tokenData = { }, noticeId } = body
  const query = { noticeId : +noticeId,}
  const updateObj = { 
      $set: {
          status:false,
          isDeleted:true
      }
  }
  const result = await MONGO_MODEL.mongoFindOneAndUpdate('notice', query, updateObj)
  
  if (!result) {
      return { status: false, message: "Notice not found" }
  }
  return { status: true, message:"Notice updated successfully" }
}

const listNotice = async (header, body) => {
  const { tokenData = {}, search, pagination } = body
  let { perPage = 10, page = 1 } = pagination || {}
  const query = { status: true }

  if (search) {
    query.$or = [
      { noticeId: { $regex: search, $options: 'i' } },
    ]
  }

  page = page - 1
  const limit = perPage
  const skip = perPage * page

  const projection = {
    noticeId: 1,
    title: 1,
    programName: 1,
    programId: 1,
    createdAt: 1,
    _id: 0
  }

  let result = await MONGO_MODEL.mongoFind('notice', query, {
    projection,
    sort: { _id: -1 },
    limit,
    skip
  })

  let totalRecords = await MONGO_MODEL.mongoCountDocuments('notice', query)
  if (!totalRecords) totalRecords = 0

  return { status: true, data: result, totalRecords }
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

export const NoticeModel = {
  createNotice,
  updateNotice,
  removeNotice,
  listNotice,
  masterData
}
