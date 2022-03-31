import FeedContent from '../components/feed/FeedContent'
import File from '../mongodb/models/File'
import Head from 'next/head'
import Resource from '../mongodb/models/Resource'
import { getSession } from 'next-auth/react'
import dbConnect from '../mongodb/dbConnect'

export default function Search({ feedJson }) {
  return (
    <>
      <Head>
        <title>Stemlink</title>
      </Head>

      <main>
        <FeedContent feed={JSON.parse(feedJson)} />
      </main>
    </>
  )
}

export async function getServerSideProps(context) {
  dbConnect()

  let session = await getSession(context)
  let file = null

  if (session) {
    file = await File.findOne({ email: session.user.email })

    if (!file) {
      file = await File.create({ ...session.user, savedLinks: [] })
    }
  }

  const query = {
    str: context.query.str || '',
    price: context.query.price || 'all',
    types: context.query.types || 'all',
    saved: context.query.saved || 'false',
    created: context.query.created || 'false',
    sort: context.query.sort || 'saves'
  }

  let reg = new RegExp(query.str.replace(/ /g, '|').replace(/\_/g, ' '), 'i')
  let mongoQuery = {
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
  let secondQuery = {}
  let mongoSort = {
    count: -1,
    rating: -1,
    publishedAt: -1
  }

  if (query.saved === 'true' && file) {
    secondQuery.saved = true
  }
  if (query.created === 'true' && file) {
    mongoQuery.$and.push({ publishedBy: file.email })
  }
  if (query.price === 'free') {
    mongoQuery.$and.push({ price: { $eq: 0 } })
  }
  if (query.price === 'paid') {
    mongoQuery.$and.push({ price: { $gt: 0 } })
  }
  if (query.types !== 'all') {
    mongoQuery.$and.push({ type: { $in: query.types.split('-') } })
  }
  if (query.sort === 'rating') {
    mongoSort = {
      rating: -1,
      count: -1,
      publishedAt: -1
    }
  }
  if (query.sort === 'date') {
    mongoSort = {
      publishedAt: -1,
      count: -1,
      rating: -1
    }
  }
  if (query.sort === 'priceascending') {
    mongoSort = {
      price: 1,
      count: -1,
      rating: -1,
      publishedAt: -1
    }
  }
  if (query.sort === 'pricedescending') {
    mongoSort = {
      price: -1,
      count: -1,
      rating: -1,
      publishedAt: -1
    }
  }

  const feed = await Resource.aggregate([
    {
      $match: mongoQuery
    },
    {
      $addFields: {
        id: {
          $toString: '$_id'
        }
      }
    },
    {
      $lookup: {
        from: 'files',
        localField: 'id',
        foreignField: 'savedLinks',
        as: 'savers'
      }
    },
    {
      $addFields: {
        savers: '$savers.email'
      }
    },
    {
      $addFields: {
        saved: {
          $in: [
            file ? file.email : '',
            '$savers'
          ]
        },
        count: {
          $size: '$savers'
        }
      }
    },
    {
      $match: secondQuery
    },
    {
      $lookup: {
        from: 'reviews',
        localField: 'id',
        foreignField: 'writtenFor',
        as: 'reviews'
      }
    },
    {
      $addFields: {
        rating: {
          $avg: '$reviews.rating'
        }
      }
    },
    {
      $sort: mongoSort
    },
    {
      $project: {
        type: 1,
        title: 1,
        author: 1,
        price: 1,
        rating: 1,
        count: 1,
        saved: 1
      }
    }
  ])

  return {
    props: {
      feedJson: JSON.stringify(feed)
    }
  }
}
