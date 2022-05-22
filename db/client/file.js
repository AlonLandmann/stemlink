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
    console.error(error)
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
    console.error(error)
    return null
  }
}
