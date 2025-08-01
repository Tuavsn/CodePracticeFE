import PostList from "@/components/posts/post-list";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Plus, TrendingUp, Users } from "lucide-react";
import CTAButtons, { CTAButtonsType } from "@/components/cta-buttons";
import ContainerLayout from "@/components/layout/container-layout";
import { PostService } from "@/lib/services/post.service";
import PostModal from "@/components/posts/post-modal";
import { Button } from "@/components/ui/button";

export default async function PostPage() {
  // Fetch posts
  const posts = await PostService.getPosts();

  const ctaButtons: { type: CTAButtonsType }[] = [
    { type: 'code' },
    { type: 'rank' },
  ]

  const renderStatsSection = () => {
    return (
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card className="gap-1 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transform hover:scale-102 transition-all duration-200 rounded-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex justify-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Users className="h-5 w-5 text-green-400" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-0">
            <div className="text-2xl font-bold text-blue-400">12,340</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Active Users</div>
          </CardContent>
        </Card>

        <Card className="gap-1 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transform hover:scale-102 transition-all duration-200 rounded-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex justify-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-400" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-0">
            <div className="text-2xl font-bold text-blue-400">56,789</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Posts</div>
          </CardContent>
        </Card>

        <Card className="gap-1 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transform hover:scale-102 transition-all duration-200 rounded-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex justify-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-400" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-0">
            <div className="text-2xl font-bold text-blue-400">1,892</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Daily</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderBreadCrumb = () => {
    return (
      <div className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-gray-600 hover:text-black transition-colors">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-black font-medium">
                Discuss
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    )
  }

  const renderCreatePostSection = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-200 rounded-full">
              <MessageSquare className="h-6 w-6 text-gray-800" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Share your ideas</h3>
              <p className="text-sm text-gray-600">Create a new post to discuss with the community</p>
            </div>
          </div>

          <PostModal
            mode="create"
            trigger={
              <Button
                className="cursor-pointer bg-black hover:bg-gray-800 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            }
          />
        </div>
      </div>
    );
  };

  return (
    <ContainerLayout>
      {/* CTA Buttons */}
      <CTAButtons buttons={ctaButtons} />

      {/* Stats Section */}
      {renderStatsSection()}

      {/* Breadcrumb */}
      {renderBreadCrumb()}

      {/* Post create section */}
      {renderCreatePostSection()}

      {/* Post list */}
      <PostList postList={posts} />

    </ContainerLayout>
  )
}