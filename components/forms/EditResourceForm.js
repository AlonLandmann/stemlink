import FormInput from './FormInput'
import FormTextarea from './FormTextarea'
import Loader from '../Loader'
import { deleteResource, putResource } from '../../db/client/resource'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import css from './EditResourceForm.module.scss'
import toast from 'react-hot-toast'
import types from '../../lib/types'
import validateResource from '../../lib/validateResource'

export default function EditForm({ resource }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    href: resource.href,
    type: resource.type,
    title: resource.title,
    author: resource.author,
    price: resource.price,
    topics: resource.topics
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isSubmitting) {
      if (Object.keys(errors).length === 0) {
        makePutRequest()
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
  function handleDelete() {
    if (confirm('Are you sure you want to delete this link?')) {
      async function executeApiCalls() {
        try {
          const success = await deleteResource(resource)

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
          toast.success('Your link has been successfully deleted!')
          router.push('/')
        } else {
          toast.error('Something went wrong')
          setIsSubmitting(false)
        }
      })
    }
  }

  function createUpdatedResource() {
    return {
      ...resource,
      ...formData,
    }
  }
  function makePutRequest() {
    async function executeApiCalls() {
      try {
        const success = await putResource(createUpdatedResource())

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
        toast.success('Your link has been updated successfully!')
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
          <div className={css.formTitle}>Edit resource information</div>

          <div>
            <div className={css.inputGroup}>
              <label htmlFor='href'>URL</label>
              <input
                id='href'
                name='href'
                type='text'
                disabled={true}
                value={formData.href}
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
            rows='4'
            value={formData.topics.join(', ')}
            onChange={handleChange}
          />

          <div className={css.buttonContainer}>
            <button type='submit'>Edit link</button>
            <button type='button' className={css.deleteButton} onClick={handleDelete}>
              Delete link
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
