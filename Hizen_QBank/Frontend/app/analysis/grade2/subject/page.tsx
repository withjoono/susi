"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calculator, TrendingUp, Target, BookOpen, AlertCircle, Calendar, BookMarked } from "lucide-react"

export default function Grade2SubjectAnalysisPage() {
  const [gradeData, setGradeData] = useState({
    korean: "",
    english: "",
    math: "",
    science1: "",
    science2: "",
    social1: "",
    social2: "",
    totalGPA: "",
    rank: "",
    totalStudents: "",
    semester: "1",
  })

  const [selectedTrack, setSelectedTrack] = useState("")
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
      currentProbability: 62,
      targetGrade: "1.4등급",
      improvementPlan: "수학 심화, 영어 안정화",
      remainingTime: "1년 6개월",
      status: "도전",
    },
    {
      university: "연세대학교",
      department: "경제학부",
      currentProbability: 78,
      targetGrade: "1.7등급",
      improvementPlan: "현재 수준 유지 및 보완",
      remainingTime: "1년 6개월",
      status: "적정",
    },
    {
      university: "고려대학교",
      department: "경영학과",
      currentProbability: 89,
      targetGrade: "2.0등급",
      remainingTime: "1년 6개월",
      improvementPlan: "안정적 관리",
      status: "안전",
    },
  ]

  const improvementPlan = [
    {
      period: "고2 2학기",
      focus: "선택과목 최적화",
      tasks: ["약점 과목 집중 보완", "선택과목 전략 수립"],
      targetGrade: "1.8등급",
    },
    {
      period: "고3 1학기",
      focus: "내신 마무리",
      tasks: ["전 과목 균형 관리", "수능 기초 다지기"],
      targetGrade: "1.5등급",
    },
    {
      period: "고3 2학기",
      focus: "수시 준비",
      tasks: ["생기부 완성", "면접 준비"],
      targetGrade: "목표 달성",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">고2 교과전형 분석</h1>
          <p className="text-lg text-gray-600">현재 성적과 선택과목을 바탕으로 구체적인 합격 전략을 제시합니다</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 성적 입력 섹션 */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  고2 내신 성적 입력
                </CardTitle>
                <CardDescription>현재까지의 내신 성적과 선택과목을 입력해주세요</CardDescription>
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
                  <div>
                    <Label>계열</Label>
                    <Select value={selectedTrack} onValueChange={setSelectedTrack}>
                      <SelectTrigger>
                        <SelectValue placeholder="계열 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="humanities">인문계열</SelectItem>
                        <SelectItem value="science">자연계열</SelectItem>
                        <SelectItem value="arts">예체능계열</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="korean">국어</Label>
                    <Input
                      id="korean"
                      placeholder="1.8"
                      value={gradeData.korean}
                      onChange={(e) => setGradeData({ ...gradeData, korean: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="english">영어</Label>
                    <Input
                      id="english"
                      placeholder="1.8"
                      value={gradeData.english}
                      onChange={(e) => setGradeData({ ...gradeData, english: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="math">수학</Label>
                    <Input
                      id="math"
                      placeholder="1.8"
                      value={gradeData.math}
                      onChange={(e) => setGradeData({ ...gradeData, math: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="science1">과학1</Label>
                    <Input
                      id="science1"
                      placeholder="1.8"
                      value={gradeData.science1}
                      onChange={(e) => setGradeData({ ...gradeData, science1: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="science2">과학2</Label>
                    <Input
                      id="science2"
                      placeholder="1.8"
                      value={gradeData.science2}
                      onChange={(e) => setGradeData({ ...gradeData, science2: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="social1">사회1</Label>
                    <Input
                      id="social1"
                      placeholder="1.8"
                      value={gradeData.social1}
                      onChange={(e) => setGradeData({ ...gradeData, social1: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="totalGPA">전체 내신 평균</Label>
                    <Input
                      id="totalGPA"
                      placeholder="1.9"
                      value={gradeData.totalGPA}
                      onChange={(e) => setGradeData({ ...gradeData, totalGPA: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rank">석차</Label>
                    <Input
                      id="rank"
                      placeholder="25"
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
                  목표 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>희망 전공 분야</Label>
                  <Select value={selectedField} onValueChange={setSelectedField}>
                    <SelectTrigger>
                      <SelectValue placeholder="전공 분야를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">경영/경제</SelectItem>
                      <SelectItem value="engineering">공학</SelectItem>
                      <SelectItem value="medicine">의학</SelectItem>
                      <SelectItem value="humanities">인문학</SelectItem>
                      <SelectItem value="science">자연과학</SelectItem>
                      <SelectItem value="law">법학</SelectItem>
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
                      교과전형 합격 가능성 분석
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
                      교과전형 합격 예측
                    </CardTitle>
                    <CardDescription>현재 성적 기준 예상 합격 가능성</CardDescription>
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

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">합격 가능성</p>
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
                              <p className="text-gray-500">남은 시간</p>
                              <p className="font-medium text-orange-600">{prediction.remainingTime}</p>
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
                      단계별 개선 계획
                    </CardTitle>
                    <CardDescription>목표 달성을 위한 구체적인 실행 계획</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {improvementPlan.map((plan, index) => (
                        <div key={index} className="border-l-4 border-purple-500 pl-4 py-3">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{plan.period}</h3>
                            <Badge variant="outline">{plan.targetGrade}</Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{plan.focus}</p>
                          <div className="space-y-2">
                            {plan.tasks.map((task, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>{task}</span>
                              </div>
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
                  <BookMarked className="h-5 w-5 text-blue-500" />
                  고2 핵심 전략
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">선택과목 최적화</p>
                    <p className="text-gray-600">전공과 연계된 선택과목을 전략적으로 선택</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">내신 집중 관리</p>
                    <p className="text-gray-600">고2는 내신 상승의 마지막 기회</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">수능 기초 다지기</p>
                    <p className="text-gray-600">내신과 수능 준비의 균형 유지</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">선택과목 가이드</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800">인문계열</p>
                    <p className="text-blue-600">사회문화, 생활과윤리, 한국지리</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-800">자연계열</p>
                    <p className="text-green-600">물리학, 화학, 생명과학</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="font-medium text-orange-800">상경계열</p>
                    <p className="text-orange-600">경제, 사회문화, 확률과통계</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">시기별 체크리스트</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>선택과목 확정</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>약점 과목 보완 계획 수립</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>목표 대학 구체화</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>생기부 활동 계획</span>
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
