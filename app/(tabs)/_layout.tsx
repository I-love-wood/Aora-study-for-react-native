import { Tabs } from 'expo-router';
import React from 'react';
// 从自定义路径导入自定义的标签栏图标组件
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  /**
   * 
   * screenOptions:配置每个标签页的选项 
   * tabBarActiveTintColor：设置活动标签的颜色，基于检测到的colorScheme
   * colorScheme ?? 'light': 这是一个逻辑运算符，表示如果 colorScheme 的值为 null 或 undefined，则使用 'light' 作为默认值。意思是如果没有检测到用户的颜色方案，则默认使用亮模式的颜色方案。
  */
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
