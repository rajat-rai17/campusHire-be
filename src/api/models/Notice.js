'use strict'

import { MONGO_MODEL } from './MongoDB'

const createNotice = async (header, body) => {
  let { tokenData = {}, ...bodyData } = body
  bodyData.status = true

  // Generate a unique noticeId
  const noticeId = await MONGO_MODEL.mongoFindOneAndUpdate(
    'counter',
    { noticeIdSeq: { $exists: true } },
    { $inc: { noticeIdSeq: 1 } }
  )

  bodyData.noticeId = noticeId.value.noticeIdSeq
  await MONGO_MODEL.mongoInsertOne('notice', bodyData)

  return { status: true, message: 'Notice created successfully' }
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
  const { tokenData = {}, noticeId } = body
  const query = { noticeId: +noticeId }
  const updateObj = {
    $set: {
      status: false,
      isDeleted: true
    }
  }

  const result = await MONGO_MODEL.mongoFindOneAndUpdate('notice', query, updateObj)

  if (!result) {
    return { status: false, message: 'Notice not found' }
  }
  return { status: true, message: 'Notice removed successfully' }
}

const listNotice = async (header, body) => {
  const { tokenData = {}, search, pagination } = body
  let { perPage = 10, page = 1 } = pagination
  const query = { status: true }

  if (search) {
    query.$or = [
      { noticeId: { $regex: search, $options: 'i' } },
      { title: { $regex: search, $options: 'i' } }
    ]
  }

  page = page - 1
  const limit = perPage
  const skip = perPage * page

  const projection = {
    noticeId: 1,
    title: 1,
    attachment: 1,
    program: 1,
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

export const NoticeModel = {
  createNotice,
  updateNotice,
  removeNotice,
  listNotice
}
