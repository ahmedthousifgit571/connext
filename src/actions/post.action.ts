"use server"

import { prisma } from "@/lib/prisma"
import { getDbUserId } from "./user.action"
import { revalidatePath } from "next/cache"

// function for create post
export async function createPost(content:string,image:string){
try {
    const userId = await getDbUserId()  //authenticated or not
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