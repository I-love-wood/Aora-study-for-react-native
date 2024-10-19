import { FlatList, TouchableOpacity, ImageBackground, Image, TextStyle, ViewStyle, ImageStyle } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'

import * as Animatable from "react-native-animatable";
import { icons } from '@/constants'

import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av'

const zoomIn = {
  0:{
    scale:0.9
  },
  1:{
    scale:1.1
  }
}

const zoomOut = {
  0:{
    scale:1.1
  },
  1:{
    scale:0.9
  }
}

const TrendingItem = ({activeItem, item}:any)=>{
    const [play, setPlay] = useState(false)
    const video = useRef<Video>(null)
    console.log(item, 'item')
    return(
      <Animatable.View
      className='mr-5'
      animation={activeItem === item.$id ? zoomIn  as Animatable.CustomAnimation<TextStyle & ViewStyle & ImageStyle> : zoomOut as Animatable.CustomAnimation<TextStyle & ViewStyle & ImageStyle>}
      duration={500}
    >
      {play ? (
        <Video
          ref={video}  
          source={{uri:'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'}}
          className='w-52 h-72 rounded-[35px] mt-3 bg-white/10'
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          useNativeControls
          onPlaybackStatusUpdate={(status:AVPlaybackStatus)=>{
            console.log(status, 'status')
            if(status.isLoaded){
              if(status.didJustFinish){
                setPlay(false)
              }
            }
            
          }}
        />
      ):(
        <TouchableOpacity 
          className='relative justify-center items-center'
          activeOpacity={0.7}
          onPress={()=>setPlay(true)}
        >
          <ImageBackground 
            source={{uri:item.thumbnail}}
            className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40'
            resizeMode='cover'
          />

          <Image 
            source={icons.play}
            className='w-12 h-12 absolute'
            resizeMode='contain'  
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
    )
    
}

const Trending = ({ posts }:any) => {
    const [activeItem, setActiveItem] = useState(posts[0])
    console.log(posts,'posts')

    const viewableItemsChanged = useCallback(({viewableItems}:any)=>{
      if(viewableItems.length > 0){
        setActiveItem(viewableItems[0].key)
      }
    },[])

    // onViewableItemsChanged:是一个回调函数，当视图中可视的项目发生变化时被调用。
    // useCallback, 确保回调函数在依赖项（这里为空数组）未变化时不会重新创建
    // viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}：可视项目的可见百分比阈值为 70%。
    // contentOffset={{ x: 170, y: 0 }}：初始内容偏移量，表示初始滚动位置。
  return (
    <FlatList 
        data={posts}
        keyExtractor={item=>item.$id}
        renderItem={({item})=>(
            <TrendingItem 
              activeItem={activeItem}
              item={item}
            />
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{itemVisiblePercentThreshold:70}}
        contentOffset={{x:170,y:0}}
        horizontal
    />
  )
}

export default Trending