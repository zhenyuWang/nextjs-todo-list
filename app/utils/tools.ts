export const base64Regex = /^data:image\/\w+;base64,/

export const isBase64Img = (base64Str: string) => {
  return base64Regex.test(base64Str)
}

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const validateEmail = (email: string) => {
  return emailRegex.test(email)
}
