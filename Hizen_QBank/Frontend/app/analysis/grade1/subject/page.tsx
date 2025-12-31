"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calculator, TrendingUp, Target, BookOpen, AlertCircle, Lightbulb, Calendar } from "lucide-react"

export default function Grade1SubjectAnalysisPage() {
  const [gradeData, setGradeData] = useState({
    korean: "",
    english: "",
    math: "",
    science: "",
    social: "",
    totalGPA: "",
    rank: "",
    totalStudents: "",
    semester: "1",
  })

  const [selectedField, setSelectedField] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 2000)
  }

  const mockPredictions = [
    {
      university: "서울대학교",
      department: "경영학과",
      currentProbability: 45,
      targetGrade: "1.3등급",
      improvementPlan: "수학, 영어 집중 학습 필요",
      status: "목표",
    },
    {
      university: "연세대학교",
      department: "경제학부",
      currentProbability: 68,
      targetGrade: "1.8등급",
      improvementPlan: "현재 수준 유지",
      status: "적정",
    },
    {
      university: "고려대학교",
      department: "경영학과",
      currentProbability: 82,
      targetGrade: "2.1등급",
      improvementPlan: "안정적 관리",
      status: "안전",
    },
  ]

  const studyPlan = [
    {
      period: "고1 2학기",
      focus: "기초 실력 다지기",
      subjects: ["수학", "영어"],
      goal: "전 과목 2등급 이내",
    },
    {
      period: "고2 1학기",
      focus: "심화 학습 시작",
      subjects: ["국어", "탐구"],
      goal: "주요 과목 1등급",
    },
    {
      period: "고2 2학기",
      focus: "진로 연계 학습",
      subjects: ["전공 관련 과목"],
      goal: "목표 대학 수준 달성",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">고1 교과전형 분석</h1>
          <p className="text-lg text-gray-600">
            현재 성적을 바탕으로 미래 합격 가능성을 예측하고 학습 계획을 제시합니다
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 성적 입력 섹션 */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  고1 내신 성적 입력
                </CardTitle>
                <CardDescription>현재까지의 내신 성적을 입력해주세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>학기</Label>
                    <Select
                      value={gradeData.semester}
                      onValueChange={(value) => setGradeData({ ...gradeData, semester: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1학기</SelectItem>
                        <SelectItem value="2">2학기</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="korean">국어</Label>
                    <Input
                      id="korean"
                      placeholder="2.0"
                      value={gradeData.korean}
                      onChange={(e) => setGradeData({ ...gradeData, korean: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="english">영어</Label>
                    <Input
                      id="english"
                      placeholder="2.0"
                      value={gradeData.english}
                      onChange={(e) => setGradeData({ ...gradeData, english: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="math">수학</Label>
                    <Input
                      id="math"
                      placeholder="2.0"
                      value={gradeData.math}
                      onChange={(e) => setGradeData({ ...gradeData, math: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="science">과학</Label>
                    <Input
                      id="science"
                      placeholder="2.0"
                      value={gradeData.science}
                      onChange={(e) => setGradeData({ ...gradeData, science: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="social">사회</Label>
                    <Input
                      id="social"
                      placeholder="2.0"
                      value={gradeData.social}
                      onChange={(e) => setGradeData({ ...gradeData, social: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="totalGPA">전체 내신 평균</Label>
                    <Input
                      id="totalGPA"
                      placeholder="2.1"
                      value={gradeData.totalGPA}
                      onChange={(e) => setGradeData({ ...gradeData, totalGPA: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rank">석차</Label>
                    <Input
                      id="rank"
                      placeholder="45"
                      value={gradeData.rank}
                      onChange={(e) => setGradeData({ ...gradeData, rank: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalStudents">전체 학생 수</Label>
                    <Input
                      id="totalStudents"
                      placeholder="300"
                      value={gradeData.totalStudents}
                      onChange={(e) => setGradeData({ ...gradeData, totalStudents: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  진로 및 관심 분야
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>관심 분야</Label>
                  <Select value={selectedField} onValueChange={setSelectedField}>
                    <SelectTrigger>
                      <SelectValue placeholder="관심 분야를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">경영/경제</SelectItem>
                      <SelectItem value="engineering">공학</SelectItem>
                      <SelectItem value="medicine">의학</SelectItem>
                      <SelectItem value="humanities">인문학</SelectItem>
                      <SelectItem value="science">자연과학</SelectItem>
                      <SelectItem value="arts">예술</SelectItem>
                      <SelectItem value="education">교육</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleAnalysis} className="w-full" disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Calculator className="mr-2 h-4 w-4 animate-spin" />
                      분석 중...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      미래 합격 가능성 분석
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 분석 결과 */}
            {!isAnalyzing && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      미래 합격 가능성 예측
                    </CardTitle>
                    <CardDescription>현재 성적을 기준으로 한 3년 후 예상 결과</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockPredictions.map((prediction, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{prediction.university}</h3>
                              <p className="text-gray-600">{prediction.department}</p>
                            </div>
                            <Badge
                              variant={
                                prediction.status === "안전"
                                  ? "default"
                                  : prediction.status === "적정"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {prediction.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">현재 예상 확률</p>
                              <div className="flex items-center gap-2">
                                <Progress value={prediction.currentProbability} className="flex-1" />
                                <span className="font-medium">{prediction.currentProbability}%</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-500">목표 성적</p>
                              <p className="font-medium">{prediction.targetGrade}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">개선 방안</p>
                              <p className="font-medium text-blue-600">{prediction.improvementPlan}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      3년 학습 로드맵
                    </CardTitle>
                    <CardDescription>목표 달성을 위한 단계별 학습 계획</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studyPlan.map((plan, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{plan.period}</h3>
                            <Badge variant="outline">{plan.goal}</Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{plan.focus}</p>
                          <div className="flex flex-wrap gap-2">
                            {plan.subjects.map((subject, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  고1 학습 가이드
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">기초 실력 다지기</p>
                    <p className="text-gray-600">고1은 기초를 탄탄히 하는 시기입니다</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">진로 탐색</p>
                    <p className="text-gray-600">다양한 분야에 관심을 가져보세요</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">학습 습관 형성</p>
                    <p className="text-gray-600">꾸준한 학습 패턴을 만들어가세요</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">고1 중요 포인트</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800">내신 관리</p>
                    <p className="text-blue-600">모든 과목을 균형있게 관리하세요</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-800">독서 활동</p>
                    <p className="text-green-600">다양한 분야의 책을 읽어보세요</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="font-medium text-purple-800">동아리 활동</p>
                    <p className="text-purple-600">관심 분야 동아리에 참여하세요</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
