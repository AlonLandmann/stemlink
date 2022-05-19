export default function cce(condition, stem, extension) {
  // conditional class extension
  if (condition) {
    return `${stem} ${extension}`
  } else {
    return stem
  }
}
