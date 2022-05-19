import Loader from '../Loader'
import { postReview } from '../../db/api/review'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import cce from '../../lib/cce'
import css from './ReviewForm.module.scss'
import toast from 'react-hot-toast'
import validateReview from '../../lib/validateReview'

export default function ReviewForm({ resource }) {
  const [formData, setFormData] = useState({
    rating: 10,
    title: '',
    content: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (isSubmitting) {
      if (Object.keys(errors).length === 0) {
        makePostRequest()
      } else {
        setIsSubmitting(false)
      }
    }
  }, [isSubmitting])

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

    if (!isSubmitting) {
      setErrors(validateReview(formData))
      setIsSubmitting(true)
    }
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
        const review = await postReview(createNewReview())

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
        setIsSubmitting(false)
      }
    })
  }

  return (
    <div className={css.formContainer}>
      {!isSubmitting &&
        <form className={css.form} onSubmit={handleSubmit}>
          <div className={css.formTitle}>
            Leave a review
          </div>

          <div>
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
          </div>
          <div>
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
          </div>
          <div>
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
          </div>

          <div className={css.buttonContainer}>
            <button type='submit'>
              Post review
            </button>
          </div>
        </form>
      }

      {isSubmitting &&
        <div className={css.submissionLoaderContainer}>
          <Loader show={isSubmitting} />
        </div>
      }
    </div>
  )
}
