import NewForm from '../forms/NewForm'
import css from './NewContent.module.scss'

export default function EditContent({ resource }) {
  return (
    <NewForm resource={resource} />
  )
}
