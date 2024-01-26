import { ReactNode } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import {
  ButtonProps,
  Input,
  InputProps,
  Label,
  Paragraph,
  SizableText,
  XStack,
  YStack,
} from 'tamagui'

export interface ITextFieldProps extends InputProps {
  label?: string
  name?: string
  endInputAdornment?: ReactNode | ((props: ButtonProps) => ReactNode)
  helperText?: string
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

function ControlledInput({
  name,
  label,
  endInputAdornment,
  helperText,
  ...props
}: IControlledInputProps) {
  const { control } = useFormContext()

  const {
    field: { value, onChange, onBlur, ref, disabled },
    fieldState: { invalid, error },
  } = useController({ name, control })

  return (
    <YStack>
      {label ? (
        <Label htmlFor={name} col={invalid ? '$red10' : undefined}>
          {label}
        </Label>
      ) : null}
      <XStack gap="$2" ai="center">
        <Input
          f={1}
          id={name}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          ref={ref}
          disabled={disabled}
          theme={invalid ? 'red' : undefined}
          {...props}
        />
        {typeof endInputAdornment === 'function'
          ? endInputAdornment({ disabled })
          : endInputAdornment}
      </XStack>
      {invalid || helperText ? (
        <SizableText col={invalid ? '$red10' : undefined} size="$3">
          {error?.message ?? helperText}
        </SizableText>
      ) : null}
    </YStack>
  )
}
