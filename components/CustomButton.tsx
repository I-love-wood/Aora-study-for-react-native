import {Text, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'

const CustomButton = ({ title, handelPress, containerStyles, textStyles, isLoading }:any) => {
  return (
    <Pressable 
        onPress={handelPress}
        style={({pressed})=>{
          return {
            opacity: pressed ? 0.7 : 1,
          }
        }}
        className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50':''}`}
        disabled={isLoading}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </Pressable>
  )
}

export default CustomButton