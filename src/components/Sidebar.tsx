import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import { UnAuthenticatedSidebar } from "./UnAuthorizedSidebar";
import { getUserByClerkId } from "@/actions/user.action";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { LinkIcon, MapPinIcon } from "lucide-react";

async function Sidebar() {
  const authUser = await currentUser();
  if (!authUser) return <UnAuthenticatedSidebar />;

  const user = await getUserByClerkId(authUser.id);
  if (!user) return null;

  return (
    <div className="sticky top-20">
      <Card className="rounded-2xl shadow-md border border-border bg-background">
        <CardContent className="pt-6 pb-4 px-6">
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${user.userName}`}
              className="flex flex-col items-center justify-center group"
            >
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-1">
                <Avatar className="w-full h-full border-2 border-background">
                  <AvatarImage
                    src={user.image || "/avatar.png"}
                    className="object-cover"
                  />
                </Avatar>
              </div>

              <div className="mt-4 space-y-1">
                <h3 className="font-semibold text-lg group-hover:underline transition">
                  {user.name}
                </h3>
                <p className="text-sm text-muted-foreground">@{user.userName}</p>
              </div>
            </Link>

            {user.bio && (
              <p className="mt-3 text-sm text-muted-foreground italic px-2">
                {user.bio}
              </p>
            )}

            <Separator className="my-4 w-full" />

            <div className="flex items-center justify-between w-full px-2">
              <div className="text-center">
                <p className="font-semibold text-lg">{user._count.following}</p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="text-center">
                <p className="font-semibold text-lg">{user._count.followers}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
            </div>

            <Separator className="my-4 w-full" />

            <div className="w-full space-y-3 text-sm px-2">
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="w-4 h-4 mr-2" />
                <span>{user.location || "No location"}</span>
              </div>

              <div className="flex items-center text-muted-foreground">
                <LinkIcon className="w-4 h-4 mr-2" />
                {user.website ? (
                  <a
                    href={user.website}
                    className="truncate text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.website}
                  </a>
                ) : (
                  <span>No website</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Sidebar;
