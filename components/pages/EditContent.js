import EditResourceForm from '../forms/EditResourceForm'
import css from './EditContent.module.scss'

export default function EditContent({ resource }) {
  return (
    <EditResourceForm resource={resource} />
  )
}
