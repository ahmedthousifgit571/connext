"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Loader2Icon, UserPlus, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { toggleToFollow } from '@/actions/user.action'

const FollowButton = ({userId}:{userId:string}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isFollowed, setIsFollowed] = useState(false)
    
    const handleFollow = async() => {
        setIsLoading(true)
        try {
           await toggleToFollow(userId)
           setIsFollowed(!isFollowed)
           toast.success(isFollowed ? "User unfollowed" : "User followed successfully", {
             style: {
               background: 'hsl(var(--background))',
               color: 'hsl(var(--foreground))',
               border: '1px solid hsl(var(--border))',
             },
           })
        } catch (error) {
          toast.error("Something went wrong", {
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
            },
          })
        } finally {
          setIsLoading(false)
        }
    }
    
  return (
    <Button
      size="sm"
      onClick={handleFollow}
      disabled={isLoading}
      className={`
        relative min-w-[88px] h-8 rounded-full font-medium text-xs transition-all duration-300 overflow-hidden
        ${isFollowed 
          ? 'bg-green-500/10 text-green-600 border border-green-500/20 hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/20' 
          : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 hover:scale-105'
        }
        group active:scale-95
      `}
    >
      <div className="flex items-center justify-center gap-1.5">
        {isLoading ? (
          <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
        ) : isFollowed ? (
          <>
            <Check className="h-3.5 w-3.5 group-hover:hidden" />
            <span className="group-hover:hidden">Following</span>
            <span className="hidden group-hover:inline">Unfollow</span>
          </>
        ) : (
          <>
            <UserPlus className="h-3.5 w-3.5" />
            <span>Follow</span>
          </>
        )}
      </div>
      
      {/* Animated background on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
    </Button>
  )
}

export default FollowButton