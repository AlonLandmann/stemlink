export async function getReview(id) {
  try {
    const res = await fetch(`https://stemlink.co/api/reviews/${id}`)
    const json = await res.json()

    if (json.success) {
      return json.data
    } else {
      console.log('error: getReview failed at api');
      return null
    }
  } catch (err) {
    console.log('error: getReview failed locally')
    return null
  }
}
export async function postReview(reviewData) {
  try {
    const res = await fetch(`https://stemlink.co/api/reviews`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    })

    const json = await res.json()

    if (json.success) {
      return json.data
    } else {
      console.log('error: postReview failed at api')
      return null
    }
  } catch (err) {
    console.log('error: postReview failed locally')
    return null
  }
}
export async function putReview(updatedReview) {
  try {
    const res = await fetch(`https://stemlink.co/api/reviews/${updatedReview._id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedReview)
    })

    const json = await res.json()

    if (json.success) {
      return json.data
    } else {
      console.log('error: putReview failed at api')
      return null
    }
  } catch (err) {
    console.log('error: putReview failed locally')
    return null
  }
}
export async function deleteReview(review) {
  try {
    const res = await fetch(`https://stemlink.co/api/reviews/${review._id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(review)
    })

    const json = await res.json()

    if (json.success) {
      return json.success
    } else {
      console.log('error: deleteReview failed at api')
      return null
    }
  } catch (error) {
    console.log('error: deleteReview failed locally')
    return null
  }
}
