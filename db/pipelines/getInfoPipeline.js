import Resource from '../models/Resource'
import Review from '../models/Review'
import dbConnect from '../dbConnect'
import reverse from 'lodash/reverse'
import sortBy from 'lodash/sortBy'

dbConnect()

export default async function getInfoPipeline(query, file) {
  query = {
    id: query.id,
    sort: query.sort || 'top'
  }

  const resource = await Resource.findOne({ _id: query.id }).lean()
  const reviews = await Review.find({ writtenFor: resource._id }).lean()

  let hydratedReviews = []

  for (let i = 0; i < reviews.length; i++) {
    hydratedReviews.push({
      ...reviews[i],
      upvoted: file ? reviews[i].upvotedBy.indexOf(file.email) > -1 : false
    })
  }

  if (query.sort === 'recent') {
    hydratedReviews = reverse(sortBy(hydratedReviews, ['writtenAt']))
  } else {
    hydratedReviews = reverse(sortBy(hydratedReviews, [rv => rv.upvotedBy.length]))
  }

  return [
    { $match: { $expr: { $eq: ['$_id', { $toObjectId: query.id }] } } },
    { $addFields: { id: { $toString: '$_id' } } },
    { $lookup: { from: 'files', localField: 'id', foreignField: 'savedLinks', as: 'savers' } },
    { $addFields: { savers: '$savers.email' } },
    { $addFields: { saved: { $in: [file ? file.email : '', '$savers'] } } },
    { $addFields: { count: { $size: '$savers' } } },
    { $addFields: { reviews: hydratedReviews } },
    { $addFields: { rating: { $avg: '$reviews.rating' } } },
    { $addFields: { reviewedByUser: { $in: [file ? file.email : '', '$reviews.writtenBy'] } } },
    { $project: { savers: 0 } }
  ]
}
