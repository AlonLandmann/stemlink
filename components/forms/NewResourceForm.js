import FormInput from './FormInput'
import FormTextarea from './FormTextarea'
import Loader from '../Loader'
import { postResource } from '../../db/client/resource'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import css from './NewResourceForm.module.scss'
import toast from 'react-hot-toast'
import types from '../../lib/types'
import validateResource from '../../lib/validateResource'

export default function NewForm() {
  const router = useRouter()
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    href: '',
    type: 'video',
    title: '',
    author: '',
    price: '',
    topics: ['']
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

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: name === 'topics' ? value.split(', ') : value
    }))
  }
  function handleSubmit(event) {
    event.preventDefault()

    if (!isSubmitting) {
      setErrors(validateResource(formData))
      setIsSubmitting(true)
    }
  }

  function createNewResource() {
    return {
      ...formData,
      publishedAt: new Date(),
      publishedBy: session.user.email,
      safetyStatus: 'fresh'
    }
  }
  function makePostRequest() {
    async function executeApiCalls() {
      try {
        const success = await postResource(createNewResource())

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
        toast.success('Your link has been posted successfully!')
        router.push('/')
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
          <div className={css.formTitle}>Share a new resource</div>

          <FormInput
            id='href'
            label='URL'
            type='text'
            placeholder='https://example.com'
            value={formData.href}
            onChange={handleChange}
            error={errors.href}
          />
          <div className={css.inputGroup}>
            <label htmlFor='type'>Type</label>
            <select
              id='type'
              name='type'
              value={formData.type}
              onChange={handleChange}
            >
              {types.map(item => (
                <option
                  key={item.type}
                  value={item.type}
                >
                  {item.display}
                </option>
              ))}
            </select>
          </div>
          <FormInput
            id='title'
            label='Title'
            type='text'
            placeholder='Title'
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
          />
          <FormInput
            id='author'
            label='Author'
            type='text'
            placeholder='Author'
            value={formData.author}
            onChange={handleChange}
            error={errors.author}
          />
          <FormInput
            id='price'
            label='Price'
            type='number'
            placeholder='Price'
            value={formData.price}
            onChange={handleChange}
            error={errors.price}
          />
          <FormTextarea
            id='topics'
            label='Topics'
            placeholder='Topic 1, Topic 2, Topic 3'
            rows='1'
            value={formData.topics.join(', ')}
            onChange={handleChange}
          />

          <div className={css.buttonContainer}>
            <button type='submit'>Post new link</button>
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
