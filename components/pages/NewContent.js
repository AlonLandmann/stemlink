import NewResourceForm from '../forms/NewResourceForm'
import css from './NewContent.module.scss'

export default function EditContent({ resource }) {
  return (
    <NewResourceForm resource={resource} />
  )
}
