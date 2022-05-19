import File from '../../../db/models/File'
import Head from 'next/head'
import Header from '../../../components/header/Header'
import InfoContent from '../../../components/pages/InfoContent'
import Resource from '../../../db/models/Resource'
import Review from '../../../db/models/Review'
import { getFile } from '../../../db/api/file'
import { getSession } from 'next-auth/react'
import dbConnect from '../../../db/dbConnect'
import reverse from 'lodash/reverse'
import sortBy from 'lodash/sortBy'

export default function Info({ resourceJson }) {
  return (
    <>
      <Head>
        <title>{JSON.parse(resourceJson).title}</title>
      </Head>

      <main>
        <Header />
        <InfoContent resource={JSON.parse(resourceJson)} />
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
    sort: context.query.sort || 'top'
  }

  let resource = await Resource.findOne({ _id: context.query.id }).lean()
  let reviews = await Review.find({ writtenFor: resource._id }).lean()
  let hydratedReviews = []

  for (let i = 0; i < reviews.length; i++) {
    hydratedReviews.push({
      ...reviews[i],
      upvoted: session ? reviews[i].upvotedBy.indexOf(session.user.email) > -1 : false
    })
  }

  if (query.sort === 'recent') {
    hydratedReviews = reverse(sortBy(hydratedReviews, ['writtenAt']))
  } else {
    hydratedReviews = reverse(sortBy(hydratedReviews, [rv => rv.upvotedBy.length]))
  }

  const hydratedResourceCursor = await Resource.aggregate([
    {
      $match: {
        $expr: {
          $eq: [
            '$_id',
            {
              $toObjectId: context.query.id
            }
          ]
        }
      }
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
        },
        reviews: hydratedReviews
      }
    },
    {
      $addFields: {
        rating: {
          $avg: '$reviews.rating'
        },
        reviewedByUser: {
          $in: [
            file ? file.email : '',
            '$reviews.writtenBy'
          ]
        }
      }
    },
    {
      $project: {
        savers: 0
      }
    }
  ])

  return {
    props: {
      resourceJson: JSON.stringify(hydratedResourceCursor[0])
    }
  }
}
