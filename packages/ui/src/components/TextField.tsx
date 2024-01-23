import { ReactNode } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { Input, InputProps, Label, Paragraph, XStack, YStack } from 'tamagui'

export interface ITextFieldProps extends InputProps {
  label?: string
  name?: string
  endInputAdornment?: ReactNode
}

export function TextField({ name, ...props }: ITextFieldProps) {
  const formContext = useFormContext()

  if (!formContext || !name) {
    const msg = !formContext
      ? 'TextInput is not placed under FormProvider'
      : 'Name for input must be provided'
    console.error(msg)

    return process.env.NODE_ENV === 'development' ? <Paragraph col="$red10">{msg}</Paragraph> : null
  }

  return <ControlledInput name={name} {...props} />
}

interface IControlledInputProps extends Omit<ITextFieldProps, 'name'> {
  name: string
}

function ControlledInput({ name, label, endInputAdornment, ...props }: IControlledInputProps) {
  const { control } = useFormContext()

  const {
    field,
    fieldState: {},
  } = useController({ name, control })

  return (
    <YStack>
      {label ? <Label htmlFor={name}>{label}</Label> : null}
      <XStack gap="$2" ai="center">
        <Input
          f={1}
          id={name}
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          ref={field.ref}
          {...props}
        />
        {endInputAdornment}
      </XStack>
    </YStack>
  )
}
