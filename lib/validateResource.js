export default function validateResource(formData) {
  let errors = {}

  // href
  const urlRegEx = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/
  if (!urlRegEx.test(formData.href)) {
    errors.href = 'The url provided is not recognized'
  } else if (!/^https:\/\//.test(formData.href)) {
    errors.href = 'Only pages using the https protocol are allowed'
  }

  // title
  if (formData.title.length < 3 || formData.title.length > 100) {
    errors.title = 'Title needs to have between 3 and 100 characters'
  }

  // Author
  if (formData.author.length < 3 || formData.author.length > 100) {
    errors.author = 'Author needs to have between 3 and 100 characters'
  }

  // Price
  if (formData.price === null || formData.price === '') {
    errors.price = 'Please enter a price. You can enter zero for free resources.'
  } else if (formData.price < 0) {
    errors.price = 'Only non-negative prices are allowed'
  }

  // Topics
  if (formData.topics.length === 1 && formData.topics[0] === '') {
    errors.topics = 'At least one topic needs to be provided'
  } else if (formData.topics.length > 10) {
    errors.topics = 'At most ten topics can be given to any one link'
  } else {
    for (let i = 0; i < formData.topics.length; i++) {
      const tp = formData.topics[i]
      if (tp.length < 3 || tp.length > 100) {
        errors.topics = 'Topics need to have between 3 and 100 characters'
      }
    }
  }

  return errors;
}
