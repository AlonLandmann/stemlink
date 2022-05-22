import FormInput from './FormInput'
import FormTextarea from './FormTextarea'
import Loader from '../Loader'
import { postReview } from '../../db/client/review'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import css from './InfoReviewForm.module.scss'
import toast from 'react-hot-toast'
import validateReview from '../../lib/validateReview'

export default function ReviewForm({ resource }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    rating: 10,
    title: '',
    content: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        const success = await postReview(createNewReview())

        if (success) {
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
          <div className={css.formTitle}>Leave a review</div>

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
          <FormInput
            id='title'
            label='Title'
            type='text'
            placeholder=''
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
          />
          <FormTextarea
            id='content'
            label='Content'
            placeholder=''
            rows='8'
            value={formData.content}
            onChange={handleChange}
          />

          <div className={css.buttonContainer}>
            <button type='submit'>Post review</button>
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
