import { emailRegex } from './tools'

export const signInFormValidationRules = {
  email: {
    required: 'Email is required!',
    pattern: {
      value: emailRegex,
      message: 'The email is incorrect.',
    },
  },
  password: {
    required: 'Password is required!',
    pattern: {
      value: /^[^\s]{8,20}$/,
      message:
        'Please enter a password of 8 to 20 characters. Spaces are not allowed.',
    },
  },
}

export const signUpFormValidationRules = {
  firstName: {
    required: 'FirstName is required!',
  },
  lastName: {
    required: 'LastName is required!',
  },
  email: {
    required: 'Email is required!',
    pattern: {
      value: emailRegex,
      message: 'The email is incorrect.',
    },
  },
  password: {
    required: 'Password is required!',
    pattern: {
      value: /^[^\s]{8,20}$/,
      message:
        'Please enter a password of 8 to 20 characters. Spaces are not allowed.',
    },
  },
  verificationCode: {
    required: 'Verification code is required!',
    pattern: {
      value: /^\d{6}$/,
      message: 'The verification code is incorrect',
    },
  },
}
