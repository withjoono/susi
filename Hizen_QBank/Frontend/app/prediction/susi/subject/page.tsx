"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calculator, TrendingUp, Target, BookOpen, Award, AlertCircle } from "lucide-react"

export default function SusiSubjectPredictionPage() {
  const [gradeData, setGradeData] = useState({
    korean: "",
    english: "",
    math: "",
    science1: "",
    science2: "",
    social: "",
    totalGPA: "",
    rank: "",
    totalStudents: "",
  })

  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedUniversity, setSelectedUniversity] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalysis = () => {
    setIsAnalyzing(true)
    // 분석 로직 시뮬레이션
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 2000)
  }

  const mockResults = [
    {
      university: "서울대학교",
      department: "경영학과",
      admissionType: "교과전형",
      probability: 85,
      cutline: "1.2등급",
      competition: "15.2:1",
      status: "안전",
    },
    {
      university: "연세대학교",
      department: "경제학부",
      admissionType: "교과전형",
      probability: 72,
      cutline: "1.5등급",
      competition: "18.7:1",
      status: "적정",
    },
    {
      university: "고려대학교",
      department: "경영학과",
      admissionType: "교과전형",
      probability: 58,
      cutline: "1.8등급",
      competition: "22.3:1",
      status: "도전",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">수시 교과전형 합격예측</h1>
          <p className="text-lg text-gray-600">내신 성적을 바탕으로 교과전형 합격 가능성을 분석합니다</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 성적 입력 섹션 */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  내신 성적 입력
                </CardTitle>
                <CardDescription>각 과목별 내신 등급을 입력해주세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="korean">국어</Label>
                    <Input
                      id="korean"
                      placeholder="1.0"
                      value={gradeData.korean}
                      onChange={(e) => setGradeData({ ...gradeData, korean: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="english">영어</Label>
                    <Input
                      id="english"
                      placeholder="1.0"
                      value={gradeData.english}
                      onChange={(e) => setGradeData({ ...gradeData, english: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="math">수학</Label>
                    <Input
                      id="math"
                      placeholder="1.0"
                      value={gradeData.math}
                      onChange={(e) => setGradeData({ ...gradeData, math: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="science1">과학1</Label>
                    <Input
                      id="science1"
                      placeholder="1.0"
                      value={gradeData.science1}
                      onChange={(e) => setGradeData({ ...gradeData, science1: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="science2">과학2</Label>
                    <Input
                      id="science2"
                      placeholder="1.0"
                      value={gradeData.science2}
                      onChange={(e) => setGradeData({ ...gradeData, science2: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="social">사회</Label>
                    <Input
                      id="social"
                      placeholder="1.0"
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
                      placeholder="1.5"
                      value={gradeData.totalGPA}
                      onChange={(e) => setGradeData({ ...gradeData, totalGPA: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rank">석차</Label>
                    <Input
                      id="rank"
                      placeholder="15"
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
                  지원 대학 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>지역</Label>
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                      <SelectTrigger>
                        <SelectValue placeholder="지역을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seoul">서울</SelectItem>
                        <SelectItem value="gyeonggi">경기</SelectItem>
                        <SelectItem value="incheon">인천</SelectItem>
                        <SelectItem value="busan">부산</SelectItem>
                        <SelectItem value="daegu">대구</SelectItem>
                        <SelectItem value="daejeon">대전</SelectItem>
                        <SelectItem value="gwangju">광주</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>대학</Label>
                    <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                      <SelectTrigger>
                        <SelectValue placeholder="대학을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="snu">서울대학교</SelectItem>
                        <SelectItem value="yonsei">연세대학교</SelectItem>
                        <SelectItem value="korea">고려대학교</SelectItem>
                        <SelectItem value="sogang">서강대학교</SelectItem>
                        <SelectItem value="hanyang">한양대학교</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                      합격 가능성 분석
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 분석 결과 */}
            {!isAnalyzing && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    교과전형 합격예측 결과
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockResults.map((result, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{result.university}</h3>
                            <p className="text-gray-600">
                              {result.department} · {result.admissionType}
                            </p>
                          </div>
                          <Badge
                            variant={
                              result.status === "안전"
                                ? "default"
                                : result.status === "적정"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {result.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">합격 가능성</p>
                            <div className="flex items-center gap-2">
                              <Progress value={result.probability} className="flex-1" />
                              <span className="font-medium">{result.probability}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-500">예상 커트라인</p>
                            <p className="font-medium">{result.cutline}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">경쟁률</p>
                            <p className="font-medium">{result.competition}</p>
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm">추천</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">분석 가이드</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">정확한 성적 입력</p>
                    <p className="text-gray-600">최신 내신 성적을 정확히 입력해주세요</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">교과전형 특징</p>
                    <p className="text-gray-600">내신 성적이 가장 중요한 평가 요소입니다</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">지원 전략</p>
                    <p className="text-gray-600">안전-적정-도전 대학을 균형있게 선택하세요</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">성적 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>1등급</span>
                    <span className="font-medium">상위 4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2등급</span>
                    <span className="font-medium">상위 11%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>3등급</span>
                    <span className="font-medium">상위 23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>4등급</span>
                    <span className="font-medium">상위 40%</span>
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
