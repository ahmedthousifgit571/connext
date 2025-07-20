// this file is to sync the user that is created in clerk to store in neonDB

"use server"

import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function syncUser(){
    try {
        const {userId} = await auth()
        const user = await currentUser()
        if(!userId || !user) return

        // check if user exists
        const existingUser = await prisma.user.findUnique({
            where:{
                clerkId:userId
            }
        })
        if(existingUser) return existingUser

        // if authenticated then create user in neonDB
        const dbUser = await prisma.user.create({
            data:{
                clerkId:userId,
                name: `${user.firstName || " "} ${user.lastName || ""}`,
                userName:user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
                email:user.emailAddresses[0].emailAddress,
                image:user.imageUrl
            }
        })
        return dbUser
    } catch (error) {
        console.log("error in syncUser",error);
        
    }
}

//function to take the user details form neonDB with joins as well (GET)
export async function getUserByClerkId (clerkId:string){
    return prisma.user.findUnique({
        where:{
            clerkId,
        },
        include:{
            _count:{
                select:{
                    followers:true,
                    following:true,
                    posts:true
                }
            }
        }
    })
}

// function to know user is authorized (GET)
export async function getDbUserId(){
    const {userId : clerkId} = await auth()
    if(!clerkId) throw new Error("Unauthorized")
    const user = await getUserByClerkId(clerkId)
    if(!user) throw new Error("User not found")

    return user.id

}

