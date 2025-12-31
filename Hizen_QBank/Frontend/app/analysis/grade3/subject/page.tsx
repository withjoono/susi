"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calculator, TrendingUp, Target, BookOpen, AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react"

export default function Grade3SubjectAnalysisPage() {
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

  const [applicationStrategy, setApplicationStrategy] = useState("")
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
      probability: 35,
      cutline: "1.2등급",
      competition: "15.2:1",
      recommendation: "정시 병행 추천",
      status: "도전",
      applicationPeriod: "수시 1차",
    },
    {
      university: "연세대학교",
      department: "경제학부",
      probability: 72,
      cutline: "1.6등급",
      competition: "12.8:1",
      recommendation: "수시 집중",
      status: "적정",
      applicationPeriod: "수시 1차",
    },
    {
      university: "고려대학교",
      department: "경영학과",
      probability: 88,
      cutline: "1.9등급",
      competition: "10.5:1",
      recommendation: "안전 지원",
      status: "안전",
      applicationPeriod: "수시 1차",
    },
    {
      university: "서강대학교",
      department: "경영학부",
      probability: 94,
      cutline: "2.2등급",
      competition: "8.3:1",
      recommendation: "안전 지원",
      status: "안전",
      applicationPeriod: "수시 2차",
    },
  ]

  const applicationSchedule = [
    {
      period: "8월",
      tasks: ["최종 성적 확정", "지원 대학 리스트 완성"],
      status: "completed",
    },
    {
      period: "9월",
      tasks: ["수시 원서 접수", "자기소개서 완성"],
      status: "current",
    },
    {
      period: "10월-11월",
      tasks: ["수시 면접 준비", "정시 대비 수능 집중"],
      status: "upcoming",
    },
    {
      period: "12월",
      tasks: ["수시 결과 확인", "정시 지원 전략 수립"],
      status: "upcoming",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">고3 교과전형 최종 분석</h1>
          <p className="text-lg text-gray-600">실제 입시를 위한 정확한 합격 가능성과 지원 전략을 제시합니다</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 성적 입력 섹션 */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  최종 내신 성적 입력
                </CardTitle>
                <CardDescription>3년간의 최종 내신 성적을 입력해주세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>기준 학기</Label>
                    <Select
                      value={gradeData.semester}
                      onValueChange={(value) => setGradeData({ ...gradeData, semester: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">3학년 1학기까지</SelectItem>
                        <SelectItem value="2">3학년 2학기까지</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>지원 전략</Label>
                    <Select value={applicationStrategy} onValueChange={setApplicationStrategy}>
                      <SelectTrigger>
                        <SelectValue placeholder="지원 전략 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="susi-focused">수시 집중</SelectItem>
                        <SelectItem value="balanced">수시/정시 병행</SelectItem>
                        <SelectItem value="jeongsi-focused">정시 집중</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="korean">국어</Label>
                    <Input
                      id="korean"
                      placeholder="1.5"
                      value={gradeData.korean}
                      onChange={(e) => setGradeData({ ...gradeData, korean: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="english">영어</Label>
                    <Input
                      id="english"
                      placeholder="1.5"
                      value={gradeData.english}
                      onChange={(e) => setGradeData({ ...gradeData, english: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="math">수학</Label>
                    <Input
                      id="math"
                      placeholder="1.5"
                      value={gradeData.math}
                      onChange={(e) => setGradeData({ ...gradeData, math: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="science1">과학1</Label>
                    <Input
                      id="science1"
                      placeholder="1.5"
                      value={gradeData.science1}
                      onChange={(e) => setGradeData({ ...gradeData, science1: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="science2">과학2</Label>
                    <Input
                      id="science2"
                      placeholder="1.5"
                      value={gradeData.science2}
                      onChange={(e) => setGradeData({ ...gradeData, science2: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="social1">사회1</Label>
                    <Input
                      id="social1"
                      placeholder="1.5"
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
                      placeholder="1.7"
                      value={gradeData.totalGPA}
                      onChange={(e) => setGradeData({ ...gradeData, totalGPA: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rank">최종 석차</Label>
                    <Input
                      id="rank"
                      placeholder="18"
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
                  최종 목표 설정
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
                      최종 분석 중...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      최종 합격 가능성 분석
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
                      교과전형 최종 합격 예측
                    </CardTitle>
                    <CardDescription>실제 지원 가능한 대학별 합격 가능성</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockPredictions.map((prediction, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{prediction.university}</h3>
                              <p className="text-gray-600">
                                {prediction.department} · {prediction.applicationPeriod}
                              </p>
                            </div>
                            <div className="flex gap-2">
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
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">합격 가능성</p>
                              <div className="flex items-center gap-2">
                                <Progress value={prediction.probability} className="flex-1" />
                                <span className="font-medium">{prediction.probability}%</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-500">예상 커트라인</p>
                              <p className="font-medium">{prediction.cutline}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">경쟁률</p>
                              <p className="font-medium">{prediction.competition}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">지원 추천</p>
                              <p className="font-medium text-blue-600">{prediction.recommendation}</p>
                            </div>
                            <div className="flex items-center justify-center">
                              {prediction.probability >= 70 ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : prediction.probability >= 40 ? (
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
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
                      <Clock className="h-5 w-5 text-orange-600" />
                      입시 일정 및 준비사항
                    </CardTitle>
                    <CardDescription>남은 입시 일정과 해야 할 일들</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {applicationSchedule.map((schedule, index) => (
                        <div key={index} className="flex items-start gap-4 p-3 rounded-lg border">
                          <div className="flex-shrink-0">
                            {schedule.status === "completed" ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                            ) : schedule.status === "current" ? (
                              <Clock className="h-5 w-5 text-orange-500 mt-1" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-gray-400 mt-1" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{schedule.period}</h3>
                            <div className="space-y-1">
                              {schedule.tasks.map((task, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                  <span
                                    className={
                                      schedule.status === "completed"
                                        ? "text-green-600"
                                        : schedule.status === "current"
                                          ? "text-orange-600"
                                          : "text-gray-600"
                                    }
                                  >
                                    {task}
                                  </span>
                                </div>
                              ))}
                            </div>
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
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  고3 핵심 전략
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <p className="font-medium text-red-800">수시 6장 전략</p>
                  <p className="text-red-600">안전 2장, 적정 2장, 도전 2장으로 구성</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <p className="font-medium text-orange-800">정시 백업 계획</p>
                  <p className="text-orange-600">수시 실패에 대비한 정시 준비 필수</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="font-medium text-blue-800">면접 준비</p>
                  <p className="text-blue-600">교과전형도 면접이 있는 경우 대비</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">지원 전략 체크</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>목표 대학 최종 확정</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>자기소개서 완성</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>면접 준비 완료</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>정시 대비 수능 준비</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>백업 대학 리스트 작성</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">긴급 연락처</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>
                  <p className="font-medium">입시 상담</p>
                  <p className="text-blue-600">010-3438-6090</p>
                </div>
                <div>
                  <p className="font-medium">이메일 상담</p>
                  <p className="text-blue-600">jys@weisenweise.com</p>
                </div>
                <div className="p-2 bg-yellow-50 rounded text-yellow-800 text-xs">
                  <p>입시 마감일이 임박했습니다. 신중한 결정을 내리세요.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
