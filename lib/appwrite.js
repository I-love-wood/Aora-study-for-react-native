import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.aora',
    projectId:'67112760000e2b56b025',
    databaseId:'67112c2a000d916ef648',
    userCollectionId:'67112c8400092884e3ff',
    videoCollectionId:'67112cdb0007ea49d6e6',
    storageId:'67112f47001bf4945d6d'
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = appwriteConfig

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setPlatform(platform);

const account = new Account(client);

const avatars = new Avatars(client);

const databases = new Databases(client);

const storage = new Storage(client)

/** Register User */
export const createUser = async (email, password, username)=>{
    try {
        /** 使用表单以及ID注册一个新账户 */
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error

        /** for created user distribution avatar */
        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password)

        /** 创建新账户，为数据库中user集合添加相应的用户信息 */
        const newUser = databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId:newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )

        return newUser;
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

/** SignIn */
export const signIn = async (email, password)=>{
    try {
        const session = await account.createEmailPasswordSession(email, password)

        return session
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

/** 获取到当前用户 */
export const getCurrentUser = async ()=>{
    try {
        /** 获取到当前账户 */
        const currentAccount = await account.get()

        if(!currentAccount) throw Error
        /** 获取给定集合collection中，所有符合query（第三个参数）的用户documents列表 */
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error

        return currentUser.documents[0]
    } catch (error) {
        console.log(error)
    }
}

export const getAllPosts = async ()=>{
    try {
        /** 按文档的创建时间 $createdAt 降序排列查询结果。 */
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const getLatestPosts = async ()=>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const searchPosts = async (query)=>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const getUserPosts = async (userId)=>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const signOut = async ()=>{
    try {
        const session = await account.deleteSession('current')

        return session;
    } catch (error) {
        throw new Error(error)
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if (type === 'vidoe') {
            fileUrl = storage.getFileView(storageId, fileId)
        }else if (type === 'image'){
            fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100)
        }else{
            throw new Error('Unsupported file type')
        }

        if(!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error)  
    }
}

export const uploadFile = async (file, type) => {
    if(!file) return

    const asset = {
        name:file.fileName,
        type:file.mimeType,
        size: file.fileSize,
        uri:file.uri,
    }

    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )

        const fileUrl = await getFilePreview(uploadedFile.$id, type)

        return fileUrl
    } catch (error) {
        throw new Error(error)
    }
}

export const createVideo = async (form)=>{
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video')
        ])

        const newPost = await databases.createDocument(
            databaseId, videoCollectionId, ID.unique(),
            {
                title:form.title,
                thumbnail:thumbnailUrl,
                video:videoUrl,
                prompt:form.prompt,
                creator: form.userId
            }
        )

        return newPost
    } catch (error) {
        throw new Error(error)
    }
}