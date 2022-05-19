import Loader from '../Loader'
import { postResource } from '../../db/api/resource'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import cce from '../../lib/cce'
import css from './NewForm.module.scss'
import toast from 'react-hot-toast'
import types from '../../lib/types'
import validateResource from '../../lib/validateResource'

export default function NewForm() {
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
          <div className={css.formTitle}>
            Share a new resource
          </div>

          <div>
            {errors.href &&
              <div className={css.errorMessage}>
                {errors.href}
              </div>
            }
            <div className={cce(errors.href, css.inputGroup, css.hasError)}>
              <label htmlFor='href'>URL</label>
              <input
                id='href'
                name='href'
                type='text'
                placeholder='https://example.com'
                autoComplete='off'
                value={formData.href}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
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
                placeholder='Title'
                autoComplete='off'
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            {errors.author &&
              <div className={css.errorMessage}>
                {errors.author}
              </div>
            }
            <div className={cce(errors.author, css.inputGroup, css.hasError)}>
              <label htmlFor='author'>Author</label>
              <input
                id='author'
                name='author'
                type='text'
                placeholder='Author'
                autoComplete='off'
                value={formData.author}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            {errors.price &&
              <div className={css.errorMessage}>
                {errors.price}
              </div>
            }
            <div className={cce(errors.price, css.inputGroup, css.hasError)}>
              <label htmlFor='price'>Price</label>
              <input
                id='price'
                name='price'
                type='number'
                placeholder='Price'
                autoComplete='off'
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            {errors.topics &&
              <div className={css.errorMessage}>
                {errors.topics}
              </div>
            }
            <div className={cce(errors.topics, css.inputGroup, css.hasError)}>
              <label htmlFor='topics'>Topics</label>
              <textarea
                id='topics'
                name='topics'
                placeholder='Topic 1, Topic 2, Topic 3'
                autoComplete='off'
                rows='1'
                value={formData.topics.join(', ')}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={css.buttonContainer}>
            <button type='submit'>
              Post new link
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
