import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Calendar, Target, TrendingUp, Users } from "lucide-react"

export default function StrategyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">수시/정시 지원 전략</h1>
          <p className="text-lg text-gray-600">개인별 성적과 특성을 분석하여 최적의 입시 전략을 제시합니다</p>
        </div>

        {/* 전략 비교 섹션 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* 수시 전략 */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Target className="h-6 w-6" />
                수시 지원 전략
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">학생부 중심 전형</h4>
                    <p className="text-sm text-gray-600">내신 성적과 비교과 활동을 종합 평가</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">논술 전형</h4>
                    <p className="text-sm text-gray-600">논술 실력으로 내신 부족분 보완 가능</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">특기자 전형</h4>
                    <p className="text-sm text-gray-600">특별한 재능이나 경험을 활용</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-200">
                <h5 className="font-medium text-gray-900 mb-2">추천 대상</h5>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">내신 우수자</Badge>
                  <Badge variant="secondary">비교과 풍부</Badge>
                  <Badge variant="secondary">논술 실력자</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 정시 전략 */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <TrendingUp className="h-6 w-6" />
                정시 지원 전략
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">수능 성적 중심</h4>
                    <p className="text-sm text-gray-600">객관적인 수능 점수로 공정한 경쟁</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">가/나/다군 전략</h4>
                    <p className="text-sm text-gray-600">3번의 지원 기회를 전략적으로 활용</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">반영비율 활용</h4>
                    <p className="text-sm text-gray-600">유리한 과목 반영비율 대학 선택</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-200">
                <h5 className="font-medium text-gray-900 mb-2">추천 대상</h5>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">수능 고득점자</Badge>
                  <Badge variant="secondary">내신 부족</Badge>
                  <Badge variant="secondary">재수생</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 시기별 전략 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              시기별 지원 전략
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <h4 className="font-semibold text-gray-900">3월~8월</h4>
                </div>
                <div className="ml-10 space-y-2">
                  <p className="text-sm text-gray-600">• 모의고사 성적 분석</p>
                  <p className="text-sm text-gray-600">• 수시 지원 대학 리스트업</p>
                  <p className="text-sm text-gray-600">• 논술/면접 준비 시작</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <h4 className="font-semibold text-gray-900">9월~11월</h4>
                </div>
                <div className="ml-10 space-y-2">
                  <p className="text-sm text-gray-600">• 수시 원서 접수</p>
                  <p className="text-sm text-gray-600">• 수능 최종 준비</p>
                  <p className="text-sm text-gray-600">• 정시 지원 전략 수립</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <h4 className="font-semibold text-gray-900">12월~2월</h4>
                </div>
                <div className="ml-10 space-y-2">
                  <p className="text-sm text-gray-600">• 수시 결과 확인</p>
                  <p className="text-sm text-gray-600">• 정시 원서 접수</p>
                  <p className="text-sm text-gray-600">• 최종 합격 확정</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 개인별 맞춤 전략 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              성적대별 맞춤 전략
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">상위권 (1~2등급)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• SKY 대학 수시 도전</li>
                  <li>• 정시 안전장치 확보</li>
                  <li>• 논술 전형 적극 활용</li>
                  <li>• 의대/약대 지원 고려</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">중위권 (3~4등급)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 수시 교과/종합 병행</li>
                  <li>• 지역거점 국립대 목표</li>
                  <li>• 수능 집중 학습</li>
                  <li>• 적성고사 대학 고려</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">하위권 (5등급 이하)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 수시 교과 전형 집중</li>
                  <li>• 지방 사립대 목표</li>
                  <li>• 특성화고 특별전형</li>
                  <li>• 전문대 우수학과 고려</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 주의사항 */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-6 w-6" />
              지원 시 주의사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">수시 지원 시</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 최대 6개 대학까지 지원 가능</li>
                  <li>• 합격 시 정시 지원 불가</li>
                  <li>• 전형료 부담 고려</li>
                  <li>• 지원 대학 간 일정 겹침 확인</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">정시 지원 시</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 가/나/다군 각 1개씩 지원</li>
                  <li>• 수능 반영비율 꼼꼼히 확인</li>
                  <li>• 전년도 커트라인 참고</li>
                  <li>• 안전/적정/도전 균형 배치</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA 버튼 */}
        <div className="text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            개인별 맞춤 전략 분석 받기
          </Button>
        </div>
      </div>
    </div>
  )
}
