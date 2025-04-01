export const validateEmailField = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return emailRegex.test(email) ? '' : 'Invalid email address'
}

export const validatePasswordField = (password: string) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

  return passwordRegex.test(password)
    ? ''
    : 'Password must contain at least 8 characters, including at least one letter and one number'
}

export const validateNameField = (name: string) => {
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{2,50}$/

  return nameRegex.test(name)
    ? ''
    : 'Name must contain only letters, spaces, apostrophes, and hyphens'
}

export const validateProfileImageField = (file: File | null) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']

  if (!file) return 'Please select a profile image'

  if (!allowedTypes.includes(file.type)) {
    return 'Profile image must be in JPG, JPEG or PNG format'
  }

  if (file.size > 2 * 1024 * 1024) {
    return 'Profile image must be less than 2MB'
  }

  return ''
}
