export default async function getFeedPipeline(query, file) {
  query = {
    str: query.str || '',
    price: query.price || 'all',
    types: query.types || 'all',
    saved: query.saved || 'false',
    created: query.created || 'false',
    sort: query.sort || 'saves',
    pagination: Number(query.pagination) || 0
  }

  const reg = new RegExp(query.str.replace(/ /g, '|').replace(/\_/g, ' '), 'i')

  let match1 = {
    $and: [
      {
        $or: [
          { title: reg },
          { author: reg },
          { topics: reg }
        ]
      }
    ]
  }
  let match2 = {}
  let sort = {
    count: -1,
    rating: -1,
    publishedAt: -1,
    _id: -1
  }

  if (file && query.saved === 'true') {
    match2.saved = true
  }
  if (file && query.created === 'true') {
    match1.$and.push({ publishedBy: file.email })
  }
  if (query.price === 'free') {
    match1.$and.push({ price: { $eq: 0 } })
  }
  if (query.price === 'paid') {
    match1.$and.push({ price: { $gt: 0 } })
  }
  if (query.types !== 'all') {
    match1.$and.push({ type: { $in: query.types.split('-') } })
  }
  if (query.sort === 'rating') {
    sort = {
      rating: -1,
      count: -1,
      publishedAt: -1,
      _id: -1
    }
  }
  if (query.sort === 'date') {
    sort = {
      publishedAt: -1,
      count: -1,
      rating: -1,
      _id: -1
    }
  }
  if (query.sort === 'priceascending') {
    sort = {
      price: 1,
      count: -1,
      rating: -1,
      publishedAt: -1,
      _id: -1
    }
  }
  if (query.sort === 'pricedescending') {
    sort = {
      price: -1,
      count: -1,
      rating: -1,
      publishedAt: -1,
      _id: -1
    }
  }

  return [
    { $match: match1 },
    { $addFields: { id: { $toString: '$_id' } } },
    { $lookup: { from: 'files', localField: 'id', foreignField: 'savedLinks', as: 'savers' } },
    { $addFields: { savers: '$savers.email' } },
    { $addFields: { saved: { $in: [file ? file.email : '', '$savers'] } } },
    { $addFields: { count: { $size: '$savers' } } },
    { $match: match2 },
    { $lookup: { from: 'reviews', localField: 'id', foreignField: 'writtenFor', as: 'reviews' } },
    { $addFields: { rating: { $avg: '$reviews.rating' } } },
    { $sort: sort },
    { $limit: 20 * (1 + query.pagination) },
    { $skip: 20 * query.pagination },
    { $project: { type: 1, title: 1, author: 1, price: 1, rating: 1, count: 1, saved: 1 } }
  ]
}
