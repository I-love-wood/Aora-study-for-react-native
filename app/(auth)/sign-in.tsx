import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '@/constants'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { getCurrentUser, signIn } from '@/lib/appwrite'

import { useGlobalContext } from "@/context/GlobalProvider"

const SignIn = () => {
  const [form, setForm] = useState({
    email:'',
    password:''
  })

  const { setUser, setIsLoggedIn } = useGlobalContext()
  /** 是否提交成功 */
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async ()=>{
    if(!form.email || !form.password){
      Alert.alert('Error','Please fill in all the fields')
    }
    setIsSubmitting(true)
    console.log(form.password)
    try {
      await signIn(form.email, form.password)
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true)


      Alert.alert('success', "User signed in successfully")
      router.replace('/(tabs)/home')
    } catch (error) {
      Alert.alert('Error')
    } finally{
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[82vh] px-4 my-6'>
          <Image 
            source={images.logo}
            resizeMode='contain'
            className='w-[115px] h-[35px]'
          />

          <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>Log in to Aora</Text>

          <FormField 
            title="email"
            value={form.email}
            handleChangeText={(e:string)=>setForm({ ...form, email:e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField 
            title="password"
            value={form.password}
            handleChangeText={(e:string)=>setForm({ ...form, password:e })}
            otherStyles="mt-7"
          />

          <CustomButton 
            title="Sign in Aora"
            handelPress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>
              Don't have account?
            </Text>
            <Link href="/(auth)/sign-up" className='text-lg font-psemibold text-secondary'>Sign up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
