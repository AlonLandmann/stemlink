export default function validateReview(formData) {
  let errors = {}

  // title
  if (formData.title.length < 3 || formData.title.length > 100) {
    errors.title = 'Title needs to have between 3 and 100 characters'
  }

  // content
  if (formData.content.length < 30 || formData.content.length > 3000) {
    errors.content = 'Content needs to have between 30 and 3000 characters'
  }

  return errors;
}
