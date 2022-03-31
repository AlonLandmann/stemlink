export default function round(num, d = 0) {
  const multiplier = Math.pow(10, d)

  return Math.round(num * multiplier) / multiplier
}
