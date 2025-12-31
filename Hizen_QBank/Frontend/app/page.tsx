import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Calculator, TrendingUp, Users, BookOpen, Award } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI 기반 대학 입시
            <span className="text-blue-600 block">합격 예측 서비스</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            수시와 정시 모든 전형의 합격 가능성을 정확하게 예측하고, 나에게 맞는 최적의 입시 전략을 제시합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3">
              <Calculator className="mr-2 h-5 w-5" />
              합격 예측 시작하기
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
              <Search className="mr-2 h-4 w-4" />
              대학 검색하기
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">왜 hizen compass를 선택해야 할까요?</h2>
            <p className="text-lg text-gray-600">정확한 데이터와 AI 분석으로 최고의 입시 컨설팅을 제공합니다</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>정확한 합격 예측</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  최근 3년간의 입시 데이터와 AI 알고리즘을 활용하여 95% 이상의 정확도로 합격 가능성을 예측합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>수시/정시 통합 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  학생부종합, 교과, 논술, 정시 등 모든 전형을 종합적으로 분석하여 최적의 지원 전략을 제시합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>개인 맞춤 컨설팅</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  개인의 성적, 비교과 활동, 희망 전공을 종합하여 1:1 맞춤형 입시 전략을 제공합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">신뢰할 수 있는 입시 파트너</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-white mb-2">50,000+</div>
              <div className="text-blue-100">누적 사용자</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-100">예측 정확도</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">200+</div>
              <div className="text-blue-100">분석 대학</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">서비스 지원</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-xl">
            <CardContent className="py-12">
              <Award className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">지금 바로 시작하세요</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                무료로 합격 가능성을 확인하고, 나만의 입시 전략을 세워보세요. 성공적인 대학 입시의 첫걸음을 함께
                시작합니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-3">
                  무료로 시작하기
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                  서비스 둘러보기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
