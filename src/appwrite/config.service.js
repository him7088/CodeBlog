import config from "../config/config";
import { Client,ID,Databases,Query,Storage } from "appwrite";

export class Service
{
    client=new Client;
    databases;
    bucket; //for storage

    constructor()
    {
        this.client.setEndpoint(config.appwriteUrl)
                    .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);

        this.bucket = new Storage(this.client);

    }

    async createPost({title,slug,content,image,status,userId})
    {

        try {

            return await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    image,
                    status,
                    userId,
                }
            )

            
        } catch (error) {
            
            throw error
            console.log("createPostError:",error);
        }
    }

    async updatePost(slug,{title,content,image,status})
    {
        try {

            return await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    image,
                    status,
                }
            )
            
        } catch (error) {
            
            console.log("updatePostError:",error);
        }
    }

    async deletePost(slug) 
    {
        try {
            
            await this.databases.deleteDocument(config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            );

            return true;
        } catch (error) {
            
            console.log("deletePostError:",error)
            return false;
        }
    }

    async getPost(slug)
    {
        try {
            
            return await this.databases.getDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug )
        } catch (error) {

            console.log("getPostsError: ", error);
        }
    }

    async getPosts()
    {
        try {

            return await  this.databases.listDocuments(
                    config.appwriteDatabaseId,
                    config.appwriteCollectionId,
                    [
                        Query.equal("status","active"),
                        
                    ]
            )
            
        } catch (error) {
            
            console.log("getPosts Error: ", error);
        }
    }


    //file upload services

    async uploadFile(file)
    {
        try {

            return await this.bucket.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file,
            )
            
        } catch (error) {

            console.log( "Upload file error", error );
            
        }
    }
    async deleteFile(fileId)
    {
        try {

            return await this.bucket.deleteFile(
                config.appwriteBucketId,
                fileId,
            
            )
            return true;
            
        } catch (error) {
            
            console.log( "Delete File Error", error );
            return false
        }
    }

    getFilePreview(fileId){
        
        try {

            return this.bucket.getFilePreview(
                config.appwriteBucketId,
                fileId

            )
            
        } catch (error) {
            
            throw error;
            console.log("Error getting preview for ", error);
        }
    }

}  

    

const service=new Service();
export default service;