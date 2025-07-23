import { getRandomUsers } from '@/actions/user.action'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import Link from 'next/link'
import { Avatar, AvatarImage } from './ui/avatar'
import FollowButton from './FollowButton'
import { Users } from 'lucide-react'

async function WhoToFollow()  {
    const users = await getRandomUsers()
    if(users.length === 0) return null

  return (
    <Card className="bg-gradient-to-br from-background to-muted/20 border-0 shadow-lg backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          <Users className="h-5 w-5 text-primary" />
          Who to Follow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {users.map((user, index) => (
          <div 
            key={user.id} 
            className="group relative flex items-center justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10 transition-all duration-300 hover:shadow-md hover:scale-[1.02] border border-transparent hover:border-border/20 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0 z-10">
              <Link href={`/profile/${user.userName}`} className="relative">
                <Avatar className="h-11 w-11 ring-2 ring-background shadow-lg group-hover:ring-primary/20 transition-all duration-300">
                  <AvatarImage 
                    src={user.image ?? "/avatar.png"} 
                    className="object-cover"
                  />
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background shadow-sm"></div>
              </Link>
              
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/profile/${user.userName}`} 
                  className="font-semibold text-sm hover:text-primary transition-colors duration-200 block truncate group-hover:translate-x-0.5 transition-transform"
                >
                  {user.name}
                </Link>
                <p className="text-muted-foreground text-xs truncate font-medium">
                  @{user.userName}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                  <p className="text-muted-foreground text-xs font-medium">
                    {user._count.followers.toLocaleString()} followers
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 z-10">
              <FollowButton userId={user.id} />
            </div>
            
            {/* Subtle background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10"></div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default WhoToFollow