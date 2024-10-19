import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '@/constants'
import SearchInput from '@/components/SearchInput'
import Trending from '@/components/Trending'
import EmptyState from '@/components/EmptyState'
import { getAllPosts, getLatestPosts } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { useLocalSearchParams } from 'expo-router'

import { useGlobalContext } from '@/context/GlobalProvider'

const Home = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext()
  // useLocalSearchParams():用于获取当前页面 URL 的查询参数
  // 例如，如果 URL 是 example.com/search?query=react，那么 useLocalSearchParams 会返回一个对象，其中包含 query 键，值为 react
  const {query} = useLocalSearchParams()
  const {data:posts, refetch} = useAppwrite(getAllPosts);
  const {data:latestPosts} = useAppwrite(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async ()=>{
    setRefreshing(true)
    // re call videos -> if any new videos appeared
    await refetch()
    setRefreshing(false)
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={posts}
        keyExtractor={(item:any)=>item.$id}
        renderItem={({item})=>(
          <VideoCard video={item} />
        )}
        ListHeaderComponent={()=>(
          <View className='my-6 px-4 space-y-6'>
            <View className='justify-between items-start flex-row mb-6'>
              <View>
                <Text className='font-pmedium text-sm text-gray-100'>
                  Welcome Back,
                </Text>
                <Text className='text-2xl font-psemibold text-white'>
                  {user.username}
                </Text>
              </View>
              <View>
                <Image 
                  source={images.logoSmall}
                  resizeMode='contain'
                  className='w-9 h-10'
                />
              </View>
            </View>

            <SearchInput initialQuery={query} />

            <View className='w-full flex-1 pt-5 pb-8'>
              <Text className='text-gray-100 text-lg font-pregular mb-3'>
                Latest Videos
              </Text>

              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={()=>(
          <EmptyState 
            title="No videos Found"
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
      </FlatList>
    </SafeAreaView>
  )
}

export default Home