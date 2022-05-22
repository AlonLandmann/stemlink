export async function getResources(query) {
  try {
    const res = await fetch(`https://stemlink.co/api/resources?${query}`)
    const json = await res.json()

    if (json.success) {
      return json.data
    } else {
      console.log('error: getResources failed at api')
      return null
    }
  } catch (err) {
    console.error(error)
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
    console.error(error)
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
    console.error(error)
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
    console.error(error)
    return null
  }
}
