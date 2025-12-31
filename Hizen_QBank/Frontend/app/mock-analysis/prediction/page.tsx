"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

const regions = [
  "전체",
  "서울",
  "경기",
  "인천",
  "대전",
  "세종",
  "충남",
  "충북",
  "광주",
  "전남",
  "전북",
  "부산",
  "울산",
  "경남",
  "제주",
]

const categories = ["전체", "자연", "인문", "예체능", "융합"]

// 대학 데이터 - 이미지와 동일하게 경희대로 통일하고 다양한 점수 범위
const universityData = [
  { name: "경희대", minScore: 400, maxScore: 500, selected: false },
  { name: "경희대", minScore: 550, maxScore: 650, selected: false },
  { name: "경희대", minScore: 500, maxScore: 700, selected: false },
  { name: "경희대", minScore: 450, maxScore: 750, selected: false },
  { name: "경희대", minScore: 350, maxScore: 550, selected: true }, // 선택된 상태
  { name: "경희대", minScore: 300, maxScore: 400, selected: false },
  { name: "경희대", minScore: 450, maxScore: 750, selected: false },
  { name: "경희대", minScore: 380, maxScore: 580, selected: false },
  { name: "경희대", minScore: 600, maxScore: 800, selected: false },
  { name: "경희대", minScore: 500, maxScore: 650, selected: false },
  { name: "경희대", minScore: 350, maxScore: 500, selected: false },
  { name: "경희대", minScore: 550, maxScore: 750, selected: false },
]

const myScore = 550 // 내 점수 - 이미지의 파란 선 위치

export default function MockAnalysisPredictionPage() {
  const [selectedRegion, setSelectedRegion] = useState("전체")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [universities, setUniversities] = useState(universityData)

  const toggleUniversity = (index: number) => {
    setUniversities((prev) => prev.map((uni, i) => (i === index ? { ...uni, selected: !uni.selected } : uni)))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <span>홈</span>
          <span>{">"}</span>
          <span>모의고사 분석</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">대학예측</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            🌳 모의고사 분석 - 대학 예측
          </h1>
          <p className="text-gray-600 mb-4">
            대학별 계산식에 따른 나의 점수를 확인해 보고 대학이 합격하기 쉬운 대학을 찾아보세요.
          </p>

          {/* Navigation Steps */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Button
              variant="outline"
              size="sm"
              className="bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
            >
              대학별 합격
            </Button>
            <ChevronRight className="w-4 h-4" />
            <span>학과별 합격</span>
            <ChevronRight className="w-4 h-4" />
            <span>위험도 확인</span>
            <ChevronRight className="w-4 h-4" />
            <span>대학 합격 점수별 비교</span>
          </div>
        </div>

        {/* Region Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-500">🗺️</span>
              <span className="font-medium">지역 선택</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <Button
                  key={region}
                  variant={selectedRegion === region ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRegion(region)}
                  className={selectedRegion === region ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  {region}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-orange-500">🔧</span>
              <span className="font-medium">계열 선택</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chart Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                ⭐ 차트에서는
                <span className="text-orange-500 font-medium">합격할 대학 비교를</span>
                위해 총점과 점수가
                <span className="text-orange-500 font-medium">1000점으로 통일</span>
                되어 있습니다.
              </p>
            </div>

            {/* University Comparison Chart */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-6 text-gray-800">학교 검색 결과</h3>

              <div className="relative">
                {/* Chart Container */}
                <div className="h-80 relative">
                  {/* Background grid lines */}
                  <div className="absolute inset-0">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="absolute left-0 right-0 border-t border-gray-200"
                        style={{ top: `${i * 64}px` }}
                      />
                    ))}
                  </div>

                  {/* My Score Line - 파란색 수평선 */}
                  <div
                    className="absolute left-0 right-0 border-t-2 border-blue-500 z-20"
                    style={{ top: `${320 - (myScore / 1000) * 320}px` }}
                  >
                    <span className="absolute left-4 -top-3 bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium">
                      내 성적
                    </span>
                  </div>

                  {/* University Bars */}
                  <div className="absolute inset-0 flex items-end justify-between px-2">
                    {universities.map((university, index) => {
                      const barHeight = ((university.maxScore - university.minScore) / 1000) * 320
                      const barBottom = ((1000 - university.maxScore) / 1000) * 320

                      return (
                        <div key={index} className="flex flex-col items-center" style={{ width: "7%" }}>
                          <div className="relative h-full flex items-end w-full">
                            <div
                              className={`w-full cursor-pointer transition-all duration-200 ${
                                university.selected
                                  ? "bg-red-500 hover:bg-red-600"
                                  : "bg-orange-500 hover:bg-orange-600"
                              }`}
                              style={{
                                height: `${barHeight}px`,
                                marginBottom: `${barBottom}px`,
                              }}
                              onClick={() => toggleUniversity(index)}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* University Names and Selectors */}
                <div className="flex justify-between mt-4 px-2">
                  {universities.map((university, index) => (
                    <div key={index} className="flex flex-col items-center" style={{ width: "7%" }}>
                      <button
                        onClick={() => toggleUniversity(index)}
                        className={`w-4 h-4 rounded-full border-2 mb-2 transition-colors duration-200 ${
                          university.selected
                            ? "bg-red-500 border-red-500"
                            : "bg-white border-gray-400 hover:border-orange-500"
                        }`}
                      />
                      <span className="text-xs text-gray-600 text-center">{university.name}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom line */}
                <div className="mt-2 border-t border-gray-300"></div>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 bg-blue-500"></div>
                  <span className="text-gray-600">내 성적</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500"></div>
                  <span className="text-gray-600">대학 점수 범위</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500"></div>
                  <span className="text-gray-600">선택된 대학</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Info Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-500">📊</span>
              <span className="font-medium">수험생 정보</span>
            </div>
            <div className="text-sm text-gray-600">
              <p>수험생 정보를 입력하시면 더 정확한 합격 예측을 제공해드립니다.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
