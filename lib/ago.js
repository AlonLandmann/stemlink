export default function ago(date) {
  const minutes = Math.floor((new Date() - date) / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  // seconds
  if (minutes < 1) {
    return 'less than a minute ago'
  }

  // minutes
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }

  // hours
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }

  // days
  if (days < 7) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  // weeks
  if (days < 30) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  }

  // months
  if (days < 365) {
    return `${months} month${months > 1 ? 's' : ''} ago`
  }

  // years
  return `${years} year${years > 1 ? 's' : ''} ago`
}
