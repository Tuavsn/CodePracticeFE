import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CheckCircle, Circle, Clock, FileText } from "lucide-react";
import CTAButtons, { CTAButtonsType } from "@/components/cta-buttons";
import ContainerLayout from "@/components/layout/container-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProblemGrid from "@/components/problems/problem-gird";

export default function ProblemPage() {
  const ctaButtons: { type: CTAButtonsType }[] = [
    { type: 'post' },
    { type: 'rank' },
  ]

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
                Coding
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    )
  }

  const renderStats = () => {
    return (
      <div className="grid grid-cols-6 gap-4 mb-8">
        <Card className="gap-1 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transform hover:scale-102 transition-all duration-200 rounded-lg">
          <CardHeader className="pb-1">
            <CardTitle className="flex justify-center">
              <div className="p-1 bg-gray-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-0">
            <div className="text-xl font-bold text-blue-400">1,247</div>
            <div className="text-xs font-semibold text-gray-500 tracking-wider">Problems</div>
          </CardContent>
        </Card>

        <Card className="gap-1 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transform hover:scale-102 transition-all duration-200 rounded-lg">
          <CardHeader className="pb-1">
            <CardTitle className="flex justify-center">
              <div className="p-1 bg-gray-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-0">
            <div className="text-xl font-bold text-blue-400">834</div>
            <div className="text-xs font-semibold text-gray-500 tracking-wider">Solved</div>
          </CardContent>
        </Card>

        <Card className="gap-1 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transform hover:scale-102 transition-all duration-200 rounded-lg">
          <CardHeader className="pb-1">
            <CardTitle className="flex justify-center">
              <div className="p-1 bg-gray-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-0">
            <div className="text-xl font-bold text-blue-400">413</div>
            <div className="text-xs font-semibold text-gray-500 tracking-wider">Pending</div>
          </CardContent>
        </Card>

        <Card className="gap-1 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transform hover:scale-102 transition-all duration-200 rounded-lg">
          <CardHeader className="pb-1">
            <CardTitle className="flex justify-center">
              <div className="p-1 bg-green-100 rounded-lg">
                <Circle className="h-5 w-5 text-green-600" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-0">
            <div className="text-xl font-bold text-green-600">456</div>
            <div className="text-xs font-semibold text-gray-500 tracking-wider">Easy</div>
          </CardContent>
        </Card>

        <Card className="gap-1 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transform hover:scale-102 transition-all duration-200 rounded-lg">
          <CardHeader className="pb-1">
            <CardTitle className="flex justify-center">
              <div className="p-1 bg-yellow-100 rounded-lg">
                <Circle className="h-5 w-5 text-yellow-600" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-0">
            <div className="text-xl font-bold text-yellow-600">567</div>
            <div className="text-xs font-semibold text-gray-500 tracking-wider">Medium</div>
          </CardContent>
        </Card>

        <Card className="gap-1 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transform hover:scale-102 transition-all duration-200 rounded-lg">
          <CardHeader className="pb-1">
            <CardTitle className="flex justify-center">
              <div className="p-1 bg-red-100 rounded-lg">
                <Circle className="h-5 w-5 text-red-600" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-0">
            <div className="text-xl font-bold text-red-600">224</div>
            <div className="text-xs font-semibold text-gray-500 tracking-wider">Hard</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ContainerLayout>
      {/* CTA Buttons */}
      <CTAButtons buttons={ctaButtons} />

      {/* Stats */}
      {renderStats()}

      {/* Breadcrumb */}
      {renderBreadCrumb()}

      {/* Problem grid */}
      <ProblemGrid />

    </ContainerLayout>
  )
}