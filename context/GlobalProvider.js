import { createContext, useContext, useState, useEffect } from "react";

import { getCurrentUser } from "@/lib/appwrite"

/** 创建一个上下文对象，通过这个对象，可以使用GlobalContext.Provider的形式将value值传递给所有子组件 */
const GlobalContext = createContext();

/** 将上下文对象中的值使用useContext()方法返回给useGlobalContext，所有子组件便可将需要使用的值从useGlobalContext中解构出来 */
export const useGlobalContext = ()=> useContext(GlobalContext)


const GlobalProvider = ({children})=>{
    /** 是否已经登录 */
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
        getCurrentUser()
        .then((res)=>{
            if(res){
                console.log(res,'当前用户')
                setIsLoggedIn(true)
                setUser(res)
            }else{
                setIsLoggedIn(false)
                setUser(null)
            }
        })
        .catch((error)=>{
            console.log(error)
        })
        .finally(()=>{
            setIsLoading(false)
        })
    },[])
    
    return(
        <GlobalContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            user,
            setUser,
            isLoading,
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;