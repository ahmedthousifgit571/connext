"use client";

import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { ImageIcon, Loader2Icon, SendIcon, Sparkles, X } from "lucide-react";
import { Button } from "./ui/button";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";

const CreatePost = () => {
  const { user } = useUser();

  // required states
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async () => {
    if(!content.trim() && !image) return
    setIsPosting(true)
    try {
       const result = await createPost(content,image)
       if(result?.success){
        // reset the form
        setContent("")
        setImage("")
        setShowImageUpload(false)
        setIsFocused(false)
        toast.success("Post created successfully! ✨", {
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        })
       }
    } catch (error) {
        console.log("failed to create the post:",error);
        toast.error("Failed to create the post", {
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        })
    }finally{
        setIsPosting(false)
    }
  };

  const characterCount = content.length;
  const maxCharacters = 280;
  const isOverLimit = characterCount > maxCharacters;

  return (
    <Card className={`
      mb-6 transition-all duration-500 hover:shadow-xl
      ${isFocused 
        ? 'ring-2 ring-primary/20 shadow-lg bg-gradient-to-br from-background to-muted/10' 
        : 'bg-gradient-to-br from-background to-muted/5'
      }
      ${isPosting ? 'animate-pulse' : ''}
    `}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header with Avatar and User Info */}
          <div className="flex items-center gap-3">
            <Avatar className={`
              w-12 h-12 ring-2 ring-background shadow-lg transition-all duration-300
              ${isFocused ? 'ring-primary/30 scale-105' : ''}
            `}>
              <AvatarImage src={user?.imageUrl || "/avatar.png"} className="object-cover" />
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-sm">{user?.fullName || "Anonymous"}</p>
              <p className="text-xs text-muted-foreground">@{user?.username || "user"}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              <span>Share your thoughts</span>
            </div>
          </div>

          {/* Content Input */}
          <div className="relative">
            <Textarea
              placeholder="What's happening? Share something amazing..."
              className={`
                min-h-[120px] resize-none border-none focus-visible:ring-0 p-4 text-base
                bg-gradient-to-br from-muted/5 to-muted/10 rounded-xl
                placeholder:text-muted-foreground/60 transition-all duration-300
                ${isFocused ? 'bg-gradient-to-br from-primary/5 to-primary/10' : ''}
              `}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isPosting}
            />
            
            {/* Character Count */}
            <div className={`
              absolute bottom-2 right-2 text-xs transition-all duration-200
              ${isOverLimit ? 'text-red-500' : characterCount > maxCharacters * 0.8 ? 'text-yellow-500' : 'text-muted-foreground'}
            `}>
              {characterCount}/{maxCharacters}
            </div>
          </div>

          {/* Image Upload Section */}
          {showImageUpload && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <div className="bg-gradient-to-r from-muted/10 to-muted/5 rounded-xl p-4 border-2 border-dashed border-muted-foreground/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                    <span>Add an image to your post</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowImageUpload(false)}
                    className="h-6 w-6 p-0 hover:bg-red-500/10 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {/* TODO: Add actual image upload functionality */}
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className={`
          flex items-center justify-between pt-4 mt-4
          ${isFocused ? 'border-t border-primary/20' : 'border-t border-border'}
          transition-all duration-300
        `}>
          <div className="flex items-center space-x-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`
                text-muted-foreground hover:text-primary hover:bg-primary/10 
                transition-all duration-200 hover:scale-105 rounded-full
                ${showImageUpload ? 'bg-primary/10 text-primary' : ''}
              `}
              onClick={() => setShowImageUpload(!showImageUpload)}
              disabled={isPosting}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Photo
            </Button>
            
            {/* Additional action buttons can go here */}
            <div className="flex items-center gap-1 ml-4">
              <div className="w-1 h-1 bg-muted-foreground/30 rounded-full"></div>
              <span className="text-xs text-muted-foreground">
                {content.trim() ? 'Ready to share' : 'Type something...'}
              </span>
            </div>
          </div>

          <Button
            className={`
              relative overflow-hidden transition-all duration-300 rounded-full min-w-[100px]
              ${(!content.trim() && !image) || isPosting || isOverLimit
                ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                : 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-primary/25 hover:scale-105'
              }
              group active:scale-95
            `}
            onClick={handleSubmit}
            disabled={(!content.trim() && !image) || isPosting || isOverLimit}
          >
            <div className="flex items-center justify-center gap-2">
              {isPosting ? (
                <>
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <SendIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  <span>Post</span>
                </>
              )}
            </div>
            
            {/* Shine effect on hover */}
            {!isPosting && !isOverLimit && (content.trim() || image) && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            )}
          </Button>
        </div>

        {/* Progress indicator when posting */}
        {isPosting && (
          <div className="mt-4 animate-in fade-in duration-300">
            <div className="w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary/60 animate-pulse"></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatePost;