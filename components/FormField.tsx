import { View, Text, TextInput, TouchableOpacity, Image, StyleProp, ViewStyle } from 'react-native'
import { useState } from 'react'
import { icons } from '@/constants'

interface FormFieldProps {
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  [key: string]: any;
}

const FormField:React.FC<FormFieldProps> = ({title, value, placeholder, handleChangeText, otherStyles, ...props}) => {
    const [ShowPassword, setShowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-gray-100 font-pmedium'>{title}</Text>

      <View className='border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row'>
        <TextInput
            className='flex-1 text-white font-psemibold text-base'
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
            secureTextEntry={title === "password" && !ShowPassword}
        />

        {title === 'password' && (
            <TouchableOpacity
                onPress={()=>setShowPassword(!ShowPassword)}
            >
                <Image
                    source={ShowPassword ? icons.eye : icons.eyeHide}
                    className='w-6 h-6'
                    resizeMode='contain'
                />
            </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField