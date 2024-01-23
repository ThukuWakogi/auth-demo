import { createStackNavigator } from '@react-navigation/stack'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { Login } from 'packages/app/features/Login'
import { Register } from 'packages/app/features/Register'
import { HomeScreen } from '../../features/home/screen'
import { UserDetailScreen } from '../../features/user/detail-screen'

type StackParamList = {
  home: undefined
  'user-detail': { id: string }
  login: undefined
  register: undefined
}

const Stack = createStackNavigator<StackParamList>()

export function NativeNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{ headerBackImage: ({ tintColor }) => <ArrowLeft color={tintColor} /> }}
    >
      <Stack.Screen name="home" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="user-detail" component={UserDetailScreen} options={{ title: 'User' }} />
      <Stack.Screen name="login" component={Login} options={{ title: 'Login' }} />
      <Stack.Screen name="register" component={Register} options={{ title: 'Register' }} />
    </Stack.Navigator>
  )
}
