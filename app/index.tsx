import { Text, View, ScrollView, Image } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Redirect, router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

import { images } from "@/constants"
import CustomButton from "@/components/CustomButton"
import { useGlobalContext } from "@/context/GlobalProvider"

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();
  // 如果不在加载状态和已经登录，那么直接跳转首页
  if(!isLoading && isLoggedIn) return <Redirect href="/(tabs)/home"/>
  // 安全区域是指在设备上显示内容时，需要避免的区域，以免内容被设备的物理特性（如刘海、圆角、传感器等）遮挡
  // SafeAreaView 确保在所有设备上（包括有刘海屏和圆角屏的设备）内容的可见性和可访问性。
  // 提供了一个简单的方法来处理不同设备的安全区域。
  return(
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{height:'100%'}}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />

          <Image 
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">Discover Endless
              Possibilities with {' '}
              <Text className="text-secondary-200">Aora</Text>
            </Text>

            <Image 
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">Where creativity meets innovation:
            embark on a journey of limitless exploration
            with Aora</Text>

          <CustomButton
            title="Continue with Email"
            handelPress = {() => {
              router.replace('/(auth)/sign-in')
            }}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light"/>
    </SafeAreaView>
  )
}