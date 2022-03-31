export async function getFile(email) {
  try {
    const res = await fetch(`https://stemlink.co/api/files/${email}`)
    const json = await res.json()

    if (json.success) {
      return json.data
    } else {
      console.log('error: getFile at api');
      return null
    }
  } catch (err) {
    console.log('error: getFile failed locally')
    return null
  }
}
export async function putFile(updatedFile) {
  try {
    const res = await fetch(`https://stemlink.co/api/files/${updatedFile.email}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedFile)
    })

    const json = await res.json()

    if (json.success) {
      return json.data
    } else {
      console.log('error: putFile failed at api')
      return null
    }
  } catch (err) {
    console.log('error: putFile failed locally')
    return null
  }
}

export async function postResource(resourceData) {
  try {
    const res = await fetch(`https://stemlink.co/api/resources`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resourceData)
    })

    const json = await res.json()

    if (json.success) {
      return json.data
    } else {
      console.log('error: postResource failed at api')
      return null
    }
  } catch (err) {
    console.log('error: postResource failed locally')
    return null
  }
}
export async function putResource(updatedResource) {
  try {
    const res = await fetch(`https://stemlink.co/api/resources/${updatedResource._id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedResource)
    })

    const json = await res.json()

    if (json.success) {
      return json.data
    } else {
      console.log('error: putResource failed at api')
      return null
    }
  } catch (error) {
    console.log('error: putResource failed locally')
    return null
  }
}
export async function deleteResource(resource) {
  try {
    const res = await fetch(`https://stemlink.co/api/resources/${resource._id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resource)
    })

    const json = await res.json()

    if (json.success) {
      return json.success
    } else {
      console.log('error: deleteResource failed at api')
      return null
    }
  } catch (error) {
    console.log('error: deleteResource failed locally')
    return null
  }
}

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
