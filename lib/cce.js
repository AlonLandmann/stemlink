export default function cce(condition, stem, extension) {
  if (condition) {
    return `${stem} ${extension}`
  } else {
    return stem
  }
}
