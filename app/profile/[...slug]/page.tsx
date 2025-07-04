'use client'

import Header from "@/components/header";
import PostCard from "@/components/posts/post-card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SmallerMainLogo from "@/components/main-logo-smaller";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/date-utils";
import { mockPosts } from "@/lib/mock-data/mock-post";
import { mockUsers } from "@/lib/mock-data/mock-user";
import { User } from "@/types/user";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Calendar, Edit, MapPin } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import ContainerLayout from "@/components/layout/container-layout";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User>(mockUsers.find((u) => u.id === userId) as User || mockUsers[0]);
  const userPosts = mockPosts.filter((post) => post.user.id === '1');
  const [activeTab, setActiveTab] = useState("posts");

  const renderBreadCrumb = () => {
    return (
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-gray-600 hover:text-black transition-colors">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-400" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-black font-medium">
              Profile
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <ContainerLayout>
      {/* Breadcrumb */}
      {renderBreadCrumb()}

      {/* Profile Header */}
      <Card className="rounded-lg border p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <Avatar className="rounded-lg h-24 w-24">
            <AvatarImage src={user.avatar || '/placehoder.svg'} alt="user" />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <Button>
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
            {user.bio && <p className="text-lg mb-4">{user.bio}</p>}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Join from {formatDate(user.createdAt as string)}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Viet Nam
              </div>
            </div>
          </div>
        </div>
        {/* User Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Comments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Reactions</div>
          </div>
        </div>
      </Card>
      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts" className="cursor-pointer">Posts</TabsTrigger>
          <TabsTrigger value="comments" className="cursor-pointer">Comments</TabsTrigger>
          <TabsTrigger value="reactions" className="cursor-pointer">Reactions</TabsTrigger>
          <TabsTrigger value="saved" className="cursor-pointer">Saved</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6">
          <div className="space-y-6">
            {userPosts.length > 0 ? (
              userPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No Post Found</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="comments" className="mt-6">
          <div className="space-y-4">

          </div>
        </TabsContent>
      </Tabs>
      {/* Profile Update Modal */}
    </ContainerLayout>
  )
}