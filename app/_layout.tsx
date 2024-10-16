/**引入导航的主题和用于处理它们的提供程序 */
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
/**引入加载自定义字体的钩子 */
import { useFonts } from 'expo-font';
/**引入栈导航 */
import { Stack } from 'expo-router';
/**引入启动屏幕模块 */
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
/**引入 React Native 重动画库 */
import 'react-native-reanimated';
/**引入自定义钩子以检测颜色方案（暗模式或亮模式）。 */
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
// 防止初始屏幕在加载完成之前自动隐藏
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  /**使用 useColorScheme 钩子来确定用户偏好暗模式还是亮模式 */
  const colorScheme = useColorScheme();
  /**加载自定义字体并将状态赋值给 loaded */
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  /**使用 useEffect 在字体加载完成后隐藏启动屏幕 */
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  /** Stack 组件包含多个 Stack.Screen 子组件，每个子组件定义一个页面
   * name：页面的名称，作为导航的标识。
   * component：要渲染的 React 组件，也就是页面内容。
   * options 用于自定义每个页面的标题、样式等,设置 headerShown 为 false，隐藏页面的头部。
   */
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
