import { putResource } from '../../mongodb/api/client'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import cce from '../../lib/cce'
import css from './EditContent.module.scss'
import toast from 'react-hot-toast'
import types from '../../lib/types'

export default function EditContent({ resource }) {
  const [formData, setFormData] = useState({
    href: resource.href,
    type: resource.type,
    title: resource.title,
    author: resource.author,
    price: resource.price,
    topics: resource.topics
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (submitting) {
      if (Object.keys(errors).length === 0) {
        makePutRequest()
      }

      setSubmitting(false)
    }
  }, [errors])

  // helper functions
  function validate() {
    let errs = {}

    // title
    if (formData.title.length < 3 || formData.title.length > 30) {
      errs.title = 'Title needs to have between 3 and 30 characters'
    }

    // Author
    if (formData.author.length < 3 || formData.author.length > 30) {
      errs.author = 'Author needs to have between 3 and 30 characters'
    }

    // Price
    if (formData.price < 0) {
      errs.price = 'Only non-negative prices are allowed'
    } else if (Math.round(formData.price * 100) !== formData.price * 100) {
      errs.price = 'Only two decimal places are allowed in giving the price'
    }

    // Topics
    if (formData.topics.length === 1 && formData.topics[0] === '') {
      errs.topics = 'At least one topic needs to be provided'
    } else if (formData.topics.length > 4) {
      errs.topics = 'At most four topics can be given to any one link'
    } else {
      for (let i = 0; i < formData.topics.length; i++) {
        const tp = formData.topics[i]
        if (tp.length < 3 || tp.length > 30) {
          errs.topics = 'Topics need to have between 3 and 30 characters'
        }
      }
    }

    return errs;
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
        const updatedResource = createUpdatedResource()
        const success = await putResource(updatedResource)

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
      }
    })
  }

  // user inputs
  function handleChange(event) {
    const { name, value } = event.target

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: name === 'topics' ? value.split(', ') : value
    }))
  }
  function handleSubmit(event) {
    event.preventDefault()

    if (!submitting) {
      setErrors(validate())
      setSubmitting(true)
    }
  }

  return (
    <div>
      <div className={css.pageTitle}>
        <div>
          Edit link
        </div>
      </div>
      <div className={css.formContainer}>
        <form className={css.form} onSubmit={handleSubmit}>
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
                rows='4'
                value={formData.topics.join(', ')}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={css.buttonContainer}>
            <button type='submit'>Edit link</button>
          </div>
        </form>
      </div>
    </div>
  )
}
