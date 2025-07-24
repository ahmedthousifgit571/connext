// this file is to sync the user that is created in clerk to store in neonDB

"use server"

import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

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
    if(!clerkId) return null
    const user = await getUserByClerkId(clerkId)
    if(!user) throw new Error("User not found")

    return user.id

}

// fetch users randomly to show in whom to follow component
export async function getRandomUsers(){
   
    try {
        const userId = await getDbUserId()
        // get random 3 users excluding ourselves and the users that we follow
         if(!userId) return[]
        const randomUser = await prisma.user.findMany({
            where:{
                AND:[
                    {NOT:{id: userId}},     //not include the own userid
                    {
                        NOT:{
                            followers:{
                                some:{
                                    followerId:userId    //exclude the followers
                                }
                            }
                        }
                    }
                ]
            },
            select:{
                id:true,
                name:true,
                userName:true,
                image:true,
                _count:{
                    select:{
                        followers:true,
                        
                    }
                }
            },
            take:3
        })
        return randomUser
    } catch (error) {
        console.log("Error fetching random users",error)
        return []
    }
}


// toggle function to follow and unfollow user
export async function toggleToFollow(targetUserId:string){
 try {
    const userId = await getDbUserId()
    if(!userId) return
    if(userId === targetUserId) throw new Error("You cannot follow yourself")
    const existingUser = await prisma.follows.findUnique({
        where:{
            followerId_followingId:{
                followerId:userId,
                followingId:targetUserId
            }
        }
    })    
    if(existingUser){
        //unfollow
        await prisma.follows.delete({
            where:{
                followerId_followingId:{
                    followerId:userId,
                    followingId:targetUserId
                }
            }
        })
    }else{
        //follow
        //transaction query in prisma (either both success or both fail)
        await prisma.$transaction([
            prisma.follows.create({
                data:{
                    followerId:userId,
                    followingId:targetUserId
                }
            }),

            prisma.notification.create({
                data:{
                    type:"FOLLOW",
                    userId:targetUserId,   //user being followed
                    creatorId: userId

                }
            })
        ])

    }
    revalidatePath("/")
    return {success:true}
 } catch (error) {
    console.log("Error in toggleToFollow",error);
    return {success:false,error:"error toggling follow"}
    
 }
}