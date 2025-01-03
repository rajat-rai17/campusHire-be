'use strict'

import { mongoClientDB } from '../../Server'

// Find ONE
const mongoFindOne = async (model, query = {}, options) => {
  const thisCollection = mongoClientDB.collection(model)
  return await thisCollection.findOne(query, options)
}

// Find ONE and Update
const mongoFindOneAndUpdate = async (model, filter, updateDoc) => {
  const thisCollection = mongoClientDB.collection(model)
  // this option instructs the method to create a document if no documents match the filter
  const options = { upsert: false }
  return await thisCollection.findOneAndUpdate(filter, updateDoc, options)
}

// Find Many
const mongoFind = async (model, query = {}, options) => {
  const thisCollection = mongoClientDB.collection(model)
  return await thisCollection.find(query, options).toArray()
}
// Insert ONE
const mongoInsertOne = async (model, doc) => {
  const thisCollection = mongoClientDB.collection(model)
  doc.createdAt = new Date()
  doc.updatedAt = new Date()
  return await thisCollection.insertOne(doc)
}
// Insert Many
const mongoInsertMany = async (model, docs) => {
  const thisCollection = mongoClientDB.collection(model)
  // this option prevents additional documents from being inserted if one fails
  const options = { ordered: true }
  return await thisCollection.insertMany(docs, options)
}
// Update ONE
const mongoUpdateOne = async (model, filter, updateDoc) => {
  const thisCollection = mongoClientDB.collection(model)
  // this option instructs the method to create a document if no documents match the filter
  const options = { upsert: true }
  return await thisCollection.updateOne(filter, updateDoc, options)
}

// Update ONE
const mongoUpdateOneWithoutUpsert = async (model, filter, updateDoc) => {
  const thisCollection = mongoClientDB.collection(model)
  // this option instructs the method to create a document if no documents match the filter
  const options = { upsert: false }
  return await thisCollection.updateOne(filter, updateDoc, options)
}
// Update Many
const mongoUpdateMany = async (model, filter, updateDocs) => {
  const thisCollection = mongoClientDB.collection(model)
  return await thisCollection.updateMany(filter, updateDocs)
}

// Count Total Documents
const mongoCountDocuments = async (model, query = {}) => {
  const thisCollection = mongoClientDB.collection(model)
  return await thisCollection.countDocuments(query)
}

const mongoDeleteOneDocument = async (model, query) => {
  const thisCollection = mongoClientDB.collection(model)
  return await thisCollection.deleteOne(query)
}

export const MONGO_MODEL = {
  mongoFindOne,
  mongoFindOneAndUpdate,
  mongoFind,
  mongoInsertOne,
  mongoInsertMany,
  mongoUpdateOne,
  mongoUpdateMany,
  mongoCountDocuments,
  mongoDeleteOneDocument,
  mongoUpdateOneWithoutUpsert
}
