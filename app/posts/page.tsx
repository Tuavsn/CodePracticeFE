'use client'
import PostList from "@/components/posts/post-list";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, TrendingUp, Users } from "lucide-react";
import CTAButtons, { CTAButtonsType } from "@/components/cta-buttons";
import ContainerLayout from "@/components/layout/container-layout";

export default function PostPage() {
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

  return (
    <ContainerLayout>
      {/* CTA Buttons */}
      <CTAButtons buttons={ctaButtons} />

      {/* Stats Section */}
      {renderStatsSection()}

      {/* Breadcrumb */}
      {renderBreadCrumb()}

      {/* Post list */}
      <PostList />

    </ContainerLayout>
  )
}