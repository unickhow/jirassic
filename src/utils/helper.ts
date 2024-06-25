export const randomId = () => {
  // TODO: use id for comparison instead of name
  return Math.random().toString(36).substring(7)
}
