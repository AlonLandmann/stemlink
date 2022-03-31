import { postReview } from '../../mongodb/api/client'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import cce from '../../lib/cce'
import css from './ReviewForm.module.scss'
import toast from 'react-hot-toast'

export default function ReviewForm({ resource }) {
  const [formData, setFormData] = useState({
    rating: 10,
    title: '',
    content: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  // form submission
  useEffect(() => {
    if (submitting) {
      if (Object.keys(errors).length === 0) {
        makePostRequest()
      } else {
        setSubmitting(false)
      }
    }
  }, [errors])

  // helper functions
  function validate() {
    let errs = {}

    // title
    if (formData.title.length < 3 || formData.title.length > 30) {
      errs.title = 'Title needs to have between 3 and 30 characters'
    }

    // content
    if (formData.content.length < 30 || formData.content.length > 1000) {
      errs.content = 'Content needs to have between 30 and 1000 characters'
    }

    return errs;
  }
  function createNewReview() {
    return {
      ...formData,
      writtenAt: new Date(),
      writtenFor: resource._id,
      writtenBy: session.user.email,
      upvotedBy: []
    }
  }
  function makePostRequest() {
    async function executeApiCalls() {
      try {
        const reviewData = createNewReview()
        const review = await postReview(reviewData)

        if (review) {
          return true
        }

        return false
      } catch (err) {
        return false
      }
    }

    executeApiCalls().then(success => {
      if (success) {
        toast.success('Your review has been posted successfully!')
        router.reload()
      } else {
        toast.error('Something went wrong')
      }
    })
  }

  // user inputs
  function handleChange(event) {
    const { name, value } = event.target

    setFormData(prevFormData => {
        return {
          ...prevFormData,
          [name]: value
        }
    })
  }
  function handleSubmit(event) {
    event.preventDefault()

    if (!submitting) {
      setErrors(validate())
      setSubmitting(true)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={css.reviewForm}>
        <div className={css.formTitle}>
          Leave a review
        </div>
        <div className={css.inputGroup}>
          <label htmlFor='rating'>Rating</label>
          <select
            id='rating'
            name='rating'
            value={formData.rating}
            onChange={handleChange}
          >
            <option value={10}>10</option>
            <option value={9}>9</option>
            <option value={8}>8</option>
            <option value={7}>7</option>
            <option value={6}>6</option>
            <option value={5}>5</option>
            <option value={4}>4</option>
            <option value={3}>3</option>
            <option value={2}>2</option>
            <option value={1}>1</option>
          </select>
        </div>
        {errors.title &&
          <div className={css.errorMessage}>
            {errors.title}
          </div>
        }
        <div className={cce(errors.title, css.inputGroup, css.hasError)}>
          <label htmlFor='title'>Title</label>
          <input
            id='title'
            name='title'
            type='text'
            autoComplete='off'
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        {errors.content &&
          <div className={css.errorMessage}>
            {errors.content}
          </div>
        }
        <div className={cce(errors.content, css.inputGroup, css.hasError)}>
          <label htmlFor='content'>Content</label>
          <textarea
            id='content'
            name='content'
            autoComplete='off'
            rows='8'
            value={formData.content}
            onChange={handleChange}
          />
        </div>
        <button className={css.submitButton} type='submit'>
          Post review
        </button>
      </div>
    </form>
  )
}
