"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MockExamPage() {
  const [activeTab, setActiveTab] = useState<"standard" | "raw">("raw")

  const [standardScores, setStandardScores] = useState({
    korean: { standard: "", grade: "", percentile: "" },
    math: { standard: "", grade: "", percentile: "" },
    english: { grade: "" },
    koreanHistory: { grade: "" },
    inquiry1: { subject: "", standard: "", grade: "", percentile: "" },
    inquiry2: { subject: "", standard: "", grade: "", percentile: "" },
    secondLanguage: {
      category: "",
      subject1: "",
    },
  })

  const [rawScores, setRawScores] = useState({
    korean: { raw: "", selectedSubject: "화법과 작문" },
    math: { raw: "", selectedSubject: "확률과 통계" },
    english: { raw: "" },
    koreanHistory: { raw: "" },
    inquiry1: { subject: "", raw: "" },
    inquiry2: { subject: "", raw: "" },
    secondLanguage: {
      category: "",
    },
  })

  const inquirySubjects = [
    "물리학I",
    "화학I",
    "생명과학I",
    "지구과학I",
    "물리학II",
    "화학II",
    "생명과학II",
    "지구과학II",
    "한국지리",
    "세계지리",
    "동아시아사",
    "세계사",
    "경제",
    "정치와법",
    "사회·문화",
  ]

  const secondLanguageSubjects = [
    "독일어I",
    "프랑스어I",
    "스페인어I",
    "중국어I",
    "일본어I",
    "러시아어I",
    "아랍어I",
    "베트남어I",
    "한문I",
  ]

  const handleStandardScoreChange = (subject: string, field: string, value: string) => {
    setStandardScores((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleRawScoreChange = (subject: string, field: string, value: string) => {
    setRawScores((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleSubmit = () => {
    if (activeTab === "standard") {
      console.log("표준점수 입력:", standardScores)
    } else {
      console.log("원점수 입력:", rawScores)
    }
  }

  const StandardScoreInput = () => (
    <div className="space-y-6">
      {/* 국어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">📝</span> 국어
          </CardTitle>
          <div className="text-sm text-gray-500">선택과목</div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="bg-blue-500 text-white border-blue-500">
              화법과 작문
            </Button>
            <Button size="sm" variant="outline">
              언어
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">표준점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                value={standardScores.korean.standard}
                onChange={(e) => handleStandardScoreChange("korean", "standard", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={standardScores.korean.grade}
                onChange={(e) => handleStandardScoreChange("korean", "grade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={standardScores.korean.percentile}
                onChange={(e) => handleStandardScoreChange("korean", "percentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 수학 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">📊</span> 수학
          </CardTitle>
          <div className="text-sm text-gray-500">선택과목</div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="bg-blue-500 text-white border-blue-500">
              확률과 통계
            </Button>
            <Button size="sm" variant="outline">
              기하
            </Button>
            <Button size="sm" variant="outline">
              미적분
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">표준점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                value={standardScores.math.standard}
                onChange={(e) => handleStandardScoreChange("math", "standard", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={standardScores.math.grade}
                onChange={(e) => handleStandardScoreChange("math", "grade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={standardScores.math.percentile}
                onChange={(e) => handleStandardScoreChange("math", "percentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 영어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">🌐</span> 영어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-32">
            <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
            <Input
              type="number"
              placeholder="0"
              min="1"
              max="9"
              value={standardScores.english.grade}
              onChange={(e) => handleStandardScoreChange("english", "grade", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 한국사 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">📚</span> 한국사
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-32">
            <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
            <Input
              type="number"
              placeholder="0"
              min="1"
              max="9"
              value={standardScores.koreanHistory.grade}
              onChange={(e) => handleStandardScoreChange("koreanHistory", "grade", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 탐구 1 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">🔬</span> 탐구 1
          </CardTitle>
          <div className="text-sm text-gray-500">과목선택</div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              과목선택
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select
              value={standardScores.inquiry1.subject}
              onValueChange={(value) => handleStandardScoreChange("inquiry1", "subject", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="과목을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {inquirySubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">표준점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                value={standardScores.inquiry1.standard}
                onChange={(e) => handleStandardScoreChange("inquiry1", "standard", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={standardScores.inquiry1.grade}
                onChange={(e) => handleStandardScoreChange("inquiry1", "grade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={standardScores.inquiry1.percentile}
                onChange={(e) => handleStandardScoreChange("inquiry1", "percentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 탐구 2 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">🔬</span> 탐구 2
          </CardTitle>
          <div className="text-sm text-gray-500">과목선택</div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              과목선택
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select
              value={standardScores.inquiry2.subject}
              onValueChange={(value) => handleStandardScoreChange("inquiry2", "subject", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="과목을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {inquirySubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">표준점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                value={standardScores.inquiry2.standard}
                onChange={(e) => handleStandardScoreChange("inquiry2", "standard", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={standardScores.inquiry2.grade}
                onChange={(e) => handleStandardScoreChange("inquiry2", "grade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={standardScores.inquiry2.percentile}
                onChange={(e) => handleStandardScoreChange("inquiry2", "percentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 제2외국어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">🌍</span> 제2외국어
          </CardTitle>
          <div className="text-sm text-gray-500">선택과목</div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {secondLanguageSubjects.map((subject) => (
              <Button
                key={subject}
                size="sm"
                variant="outline"
                className={
                  standardScores.secondLanguage.category === subject ? "bg-blue-500 text-white border-blue-500" : ""
                }
                onClick={() => handleStandardScoreChange("secondLanguage", "category", subject)}
              >
                {subject}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              className={
                standardScores.secondLanguage.category === "기타" ? "bg-blue-500 text-white border-blue-500" : ""
              }
              onClick={() => handleStandardScoreChange("secondLanguage", "category", "기타")}
            >
              기타
            </Button>
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
            <Input
              type="number"
              placeholder="0"
              min="1"
              max="9"
              value={standardScores.secondLanguage.subject1}
              onChange={(e) => handleStandardScoreChange("secondLanguage", "subject1", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const RawScoreInput = () => (
    <div className="space-y-6">
      {/* 국어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">📝</span> 국어
          </CardTitle>
          <div className="text-sm text-gray-500">선택과목</div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className={rawScores.korean.selectedSubject === "화법" ? "bg-blue-500 text-white border-blue-500" : ""}
              onClick={() => handleRawScoreChange("korean", "selectedSubject", "화법")}
            >
              화법
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={rawScores.korean.selectedSubject === "언어" ? "bg-blue-500 text-white border-blue-500" : ""}
              onClick={() => handleRawScoreChange("korean", "selectedSubject", "언어")}
            >
              언어
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">원점수 (0~76)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="76"
                value={rawScores.korean.raw}
                onChange={(e) => handleRawScoreChange("korean", "raw", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">선택과목 (0~24)</label>
              <Input type="number" placeholder="0" min="0" max="24" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 수학 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">📊</span> 수학
          </CardTitle>
          <div className="text-sm text-gray-500">선택과목</div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className={rawScores.math.selectedSubject === "확률" ? "bg-blue-500 text-white border-blue-500" : ""}
              onClick={() => handleRawScoreChange("math", "selectedSubject", "확률")}
            >
              확률
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={rawScores.math.selectedSubject === "기하" ? "bg-blue-500 text-white border-blue-500" : ""}
              onClick={() => handleRawScoreChange("math", "selectedSubject", "기하")}
            >
              기하
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={rawScores.math.selectedSubject === "미분" ? "bg-blue-500 text-white border-blue-500" : ""}
              onClick={() => handleRawScoreChange("math", "selectedSubject", "미분")}
            >
              미분
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">원점수 (0~74)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="74"
                value={rawScores.math.raw}
                onChange={(e) => handleRawScoreChange("math", "raw", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">선택과목 (0~26)</label>
              <Input type="number" placeholder="0" min="0" max="26" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 영어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">🌐</span> 영어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-32">
            <label className="block text-sm font-medium mb-1">원점수 (0~100)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="100"
              value={rawScores.english.raw}
              onChange={(e) => handleRawScoreChange("english", "raw", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 한국사 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">📚</span> 한국사
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-32">
            <label className="block text-sm font-medium mb-1">원점수 (0~50)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="50"
              value={rawScores.koreanHistory.raw}
              onChange={(e) => handleRawScoreChange("koreanHistory", "raw", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 탐구 1 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">🔬</span> 탐구 1
          </CardTitle>
          <div className="text-sm text-gray-500">과목선택</div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              과목선택
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select
              value={rawScores.inquiry1.subject}
              onValueChange={(value) => handleRawScoreChange("inquiry1", "subject", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="과목을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {inquirySubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium mb-1">원점수 (0~50)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="50"
              value={rawScores.inquiry1.raw}
              onChange={(e) => handleRawScoreChange("inquiry1", "raw", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 탐구 2 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">🔬</span> 탐구 2
          </CardTitle>
          <div className="text-sm text-gray-500">과목선택</div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              과목선택
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select
              value={rawScores.inquiry2.subject}
              onValueChange={(value) => handleRawScoreChange("inquiry2", "subject", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="과목을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {inquirySubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium mb-1">원점수 (0~50)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="50"
              value={rawScores.inquiry2.raw}
              onChange={(e) => handleRawScoreChange("inquiry2", "raw", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 제2외국어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">🌍</span> 제2외국어
          </CardTitle>
          <div className="text-sm text-gray-500">선택과목</div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {secondLanguageSubjects.map((subject) => (
              <Button
                key={subject}
                size="sm"
                variant="outline"
                className={
                  rawScores.secondLanguage.category === subject ? "bg-blue-500 text-white border-blue-500" : ""
                }
                onClick={() => handleRawScoreChange("secondLanguage", "category", subject)}
              >
                {subject}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              className={rawScores.secondLanguage.category === "기타" ? "bg-blue-500 text-white border-blue-500" : ""}
              onClick={() => handleRawScoreChange("secondLanguage", "category", "기타")}
            >
              기타
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={activeTab === "raw" ? "default" : "outline"}
              className={activeTab === "raw" ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}
              onClick={() => setActiveTab("raw")}
            >
              원점수 입력
            </Button>
            <Button
              size="sm"
              variant={activeTab === "standard" ? "default" : "outline"}
              className={activeTab === "standard" ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}
              onClick={() => setActiveTab("standard")}
            >
              표준점수 입력
            </Button>
          </div>
        </div>

        {activeTab === "standard" ? <StandardScoreInput /> : <RawScoreInput />}

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2">
            입력하기
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">학생 성적의 수집 및 활용에 동의합니다.</div>
      </div>
    </div>
  )
}
