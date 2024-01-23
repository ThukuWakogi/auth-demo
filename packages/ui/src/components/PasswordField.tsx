import { Eye, EyeOff } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Button } from 'tamagui'
import { ITextFieldProps, TextField } from './TextField'

export function PasswordField(props: ITextFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <TextField
      label="Password"
      name="password"
      secureTextEntry={!showPassword}
      endInputAdornment={
        <Button
          icon={showPassword ? <EyeOff /> : <Eye />}
          variant="outlined"
          onPress={() => setShowPassword((state) => !state)}
        />
      }
      {...props}
    />
  )
}
