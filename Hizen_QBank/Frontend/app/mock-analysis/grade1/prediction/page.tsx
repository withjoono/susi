"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

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

// 차트 데이터 (예시)
const chartData = [
  { name: "0", value: 100 },
  { name: "10", value: 100 },
  { name: "20", value: 100 },
  { name: "30", value: 100 },
  { name: "40", value: 100 },
  { name: "50", value: 100 },
  { name: "60", value: 100 },
  { name: "70", value: 100 },
  { name: "80", value: 100 },
  { name: "90", value: 100 },
  { name: "100", value: 100 },
]

export default function MockAnalysisGrade1PredictionPage() {
  const [selectedRegion, setSelectedRegion] = useState("전체")
  const [selectedCategory, setSelectedCategory] = useState("전체")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            🌳 모의고사 분석 - 대학 예측 (고1)
          </h1>
          <p className="text-gray-600 mb-4">
            대학별 계산식에 따른 나의 점수를 확인해 보고 대학이 합격하기 쉬운 대학을 찾아보세요.
          </p>

          {/* Breadcrumb */}
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

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#666" }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#ff6b35" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Chart Legend */}
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded text-sm">
                내 백분위
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
