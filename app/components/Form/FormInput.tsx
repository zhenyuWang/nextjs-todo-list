import { Input } from '@nextui-org/react'
import { ReactElement } from 'react'
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form'

export default function FormInput({
  defaultValue = '',
  label = '',
  placeholder = '',
  description = '',
  register = null,
  name = '',
  size = 'lg',
  type = 'text',
  color = 'default',
  variant = 'bordered',
  labelPlacement = 'outside',
  endContent = null,
  validationRule = {},
  onChange = (val) => {},
  error = undefined,
}: {
  defaultValue?: string
  label: string
  placeholder: string
  description?: string
  register: any
  name: string
  size?: 'sm' | 'md' | 'lg'
  type?: string
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  variant?: 'bordered' | 'flat' | 'underlined' | 'faded'
  labelPlacement?: 'outside' | 'outside-left' | 'inside'
  endContent?: ReactElement | null
  validationRule?: Record<string, any>
  onChange?: (e: any) => void
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>
}) {
  // Notice: Do not use both the Input isRequired and the react-hook-form validation to check the required fields at the same time.
  // Input isRequired will cause the react - hook - form required fields to be invalid
  return (
    <>
      {register ? (
        <Input
          label={label}
          size={size}
          type={type}
          color={color}
          variant={variant}
          defaultValue={defaultValue}
          labelPlacement={labelPlacement}
          placeholder={placeholder}
          description={description}
          endContent={endContent}
          onValueChange={onChange}
          {...register(name, validationRule)}
        />
      ) : (
        <Input
          label={label}
          size={size}
          type={type}
          color={color}
          variant={variant}
          defaultValue={defaultValue}
          labelPlacement={labelPlacement}
          placeholder={placeholder}
          description={description}
          endContent={endContent}
          onValueChange={onChange}
        />
      )}
      <div className='mt-2 text-black dark:text-white'>
        {error?.message as string}
      </div>
    </>
  )
}
