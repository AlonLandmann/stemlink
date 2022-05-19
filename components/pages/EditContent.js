import EditForm from '../forms/EditForm'
import css from './EditContent.module.scss'

export default function EditContent({ resource }) {
  return (
    <EditForm resource={resource} />
  )
}
