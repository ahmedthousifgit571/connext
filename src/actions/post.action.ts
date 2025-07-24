"use server"

import { prisma } from "@/lib/prisma"
import { getDbUserId } from "./user.action"
import { revalidatePath } from "next/cache"

// function for create post
export async function createPost(content:string,image:string){
try {
    const userId = await getDbUserId()  //authenticated or not
    if(!userId) return
    const post = await prisma.post.create({
        data:{
            content,
            image,
            authorId:userId
        }
    })
    revalidatePath('/')  //purge the cache for the home page
    return {success:true,post}
} catch (error) {
    console.log("failed to create post:",error);
    return {success:false,error:"failed to create post"}
    
}
}

//fetch all post function
export async function getPosts(){
   try {
    const posts = await prisma.post.findMany({
        orderBy:{
            createdAt:"desc"
        },
        include:{
            author:{
                select:{
                    name:true,
                    image:true,
                    userName:true
                }
            },
            comments:{
                include:{
                    author:{
                        select:{
                            id:true,
                            userName:true,
                            image:true,
                            name:true
                        }
                    }
                },
                orderBy:{
                    createdAt:"asc"
                }
            },
            likes:{
                select:{
                    userId:true
                }
            },
            _count:{
                select:{
                    likes:true,
                    comments:true
                }
            }
        }
    })
    return posts
   } catch (error) {
    console.log("Error in getPosts",error);
    throw new Error("failed to fetch post")
    
   }
}