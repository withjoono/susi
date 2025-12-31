"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function MockExamScoreInputPage() {
  const [activeGrade, setActiveGrade] = useState<"grade1" | "grade2" | "grade3">("grade1")
  const [grade1ScoreType, setGrade1ScoreType] = useState<"standard" | "raw">("raw")
  const [grade2ScoreType, setGrade2ScoreType] = useState<"standard" | "raw">("raw")
  const [grade3ScoreType, setGrade3ScoreType] = useState<"standard" | "raw">("raw")

  // Grade 1 Mock Exam Scores (Standard)
  const [grade1StandardScores, setGrade1StandardScores] = useState({
    korean: { standard: "", grade: "", percentile: "" },
    math: { standard: "", grade: "", percentile: "" },
    english: { grade: "" },
    koreanHistory: { grade: "" },
    integratedScience: { standard: "", grade: "", percentile: "" },
    integratedSocial: { standard: "", grade: "", percentile: "" },
    exam: "3월 모의고사",
    year: "2025",
  })

  // Grade 1 Mock Exam Scores (Raw)
  const [grade1RawScores, setGrade1RawScores] = useState({
    korean: { raw: "" },
    math: { raw: "" },
    english: { raw: "" },
    koreanHistory: { raw: "" },
    integratedScience: { raw: "" },
    integratedSocial: { raw: "" },
    exam: "3월 모의고사",
    year: "2025",
  })

  // Grade 2 Mock Exam Scores (Standard)
  const [grade2StandardScores, setGrade2StandardScores] = useState({
    korean: { standard: "", grade: "", percentile: "" },
    math: { standard: "", grade: "", percentile: "" },
    english: { grade: "" },
    koreanHistory: { grade: "" },
    inquiry1: { subject: "", standard: "", grade: "", percentile: "" },
    inquiry2: { subject: "", standard: "", grade: "", percentile: "" },
    exam: "3월 모의고사",
    year: "2025",
  })

  // Grade 2 Mock Exam Scores (Raw)
  const [grade2RawScores, setGrade2RawScores] = useState({
    korean: { raw: "" },
    math: { raw: "" },
    english: { raw: "" },
    koreanHistory: { raw: "" },
    inquiry1: { subject: "", raw: "" },
    inquiry2: { subject: "", raw: "" },
    exam: "3월 모의고사",
    year: "2025",
  })

  // Grade 3 Mock Exam Scores (Standard) - 정시합격예측 스타일
  const [grade3StandardScores, setGrade3StandardScores] = useState({
    korean: { standard: "", grade: "", percentile: "", selectedSubject: "화법과 작문" },
    math: { standard: "", grade: "", percentile: "", selectedSubject: "확률과 통계" },
    english: { grade: "" },
    koreanHistory: { grade: "" },
    inquiry1: { subject: "", standard: "", grade: "", percentile: "" },
    inquiry2: { subject: "", standard: "", grade: "", percentile: "" },
    secondLanguage: {
      category: "",
      subject1: "",
    },
    exam: "3월 모의고사",
    year: "2025",
  })

  // Grade 3 Mock Exam Scores (Raw) - 정시합격예측 스타일
  const [grade3RawScores, setGrade3RawScores] = useState({
    korean: { raw: "", selectedSubject: "화법과 작문" },
    math: { raw: "", selectedSubject: "확률과 통계" },
    english: { raw: "" },
    koreanHistory: { raw: "" },
    inquiry1: { subject: "", raw: "" },
    inquiry2: { subject: "", raw: "" },
    secondLanguage: {
      category: "",
    },
    exam: "3월 모의고사",
    year: "2025",
  })

  const grade1MockExamOptions = ["3월 모의고사", "6월 모의고사", "9월 모의고사", "10월 모의고사"]

  const mockExamOptions = [
    "3월 모의고사",
    "4월 모의고사",
    "6월 모의고사",
    "7월 모의고사",
    "9월 모의고사",
    "10월 모의고사",
    "11월 모의고사",
  ]

  const yearOptions = ["2025", "2024", "2023", "2022", "2021"]

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

  const handleGrade1StandardScoreChange = (subject: string, field: string, value: string) => {
    setGrade1StandardScores((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleGrade1StandardExamChange = (field: string, value: string) => {
    setGrade1StandardScores((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleGrade1RawScoreChange = (subject: string, field: string, value: string) => {
    setGrade1RawScores((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleGrade1RawExamChange = (field: string, value: string) => {
    setGrade1RawScores((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Grade 2 handlers
  const handleGrade2StandardScoreChange = (subject: string, field: string, value: string) => {
    setGrade2StandardScores((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleGrade2StandardExamChange = (field: string, value: string) => {
    setGrade2StandardScores((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleGrade2RawScoreChange = (subject: string, field: string, value: string) => {
    setGrade2RawScores((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleGrade2RawExamChange = (field: string, value: string) => {
    setGrade2RawScores((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Grade 3 handlers
  const handleGrade3StandardScoreChange = (subject: string, field: string, value: string) => {
    setGrade3StandardScores((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleGrade3StandardExamChange = (field: string, value: string) => {
    setGrade3StandardScores((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleGrade3RawScoreChange = (subject: string, field: string, value: string) => {
    setGrade3RawScores((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleGrade3RawExamChange = (field: string, value: string) => {
    setGrade3RawScores((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    if (activeGrade === "grade1") {
      if (grade1ScoreType === "standard") {
        console.log("고1 표준점수:", grade1StandardScores)
      } else {
        console.log("고1 원점수:", grade1RawScores)
      }
    } else if (activeGrade === "grade2") {
      if (grade2ScoreType === "standard") {
        console.log("고2 표준점수:", grade2StandardScores)
      } else {
        console.log("고2 원점수:", grade2RawScores)
      }
    } else {
      if (grade3ScoreType === "standard") {
        console.log("고3/재수 표준점수:", grade3StandardScores)
      } else {
        console.log("고3/재수 원점수:", grade3RawScores)
      }
    }
  }

  // Grade 1 Raw Score Input Component
  const Grade1RawScoreInput = () => (
    <div className="space-y-6">
      {/* Exam Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">모의고사 선택</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year-select">연도</Label>
              <Select value={grade1RawScores.year} onValueChange={(value) => handleGrade1RawExamChange("year", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="연도를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}년
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exam-select">모의고사</Label>
              <Select value={grade1RawScores.exam} onValueChange={(value) => handleGrade1RawExamChange("exam", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="모의고사를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {grade1MockExamOptions.map((exam) => (
                    <SelectItem key={exam} value={exam}>
                      {exam}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">성적 입력</CardTitle>
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              className={grade1ScoreType === "raw" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
              variant={grade1ScoreType === "raw" ? "default" : "outline"}
              onClick={() => setGrade1ScoreType("raw")}
            >
              원점수 입력
            </Button>
            <Button
              size="sm"
              variant={grade1ScoreType === "standard" ? "default" : "outline"}
              className={grade1ScoreType === "standard" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
              onClick={() => setGrade1ScoreType("standard")}
            >
              표준점수 입력
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 국어 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-orange-500">📝</span> 국어
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-48">
                <label className="block text-sm font-medium mb-1">원점수 (0~100)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={grade1RawScores.korean.raw}
                  onChange={(e) => handleGrade1RawScoreChange("korean", "raw", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 수학 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-blue-500">📊</span> 수학
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-48">
                <label className="block text-sm font-medium mb-1">원점수 (0~100)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={grade1RawScores.math.raw}
                  onChange={(e) => handleGrade1RawScoreChange("math", "raw", e.target.value)}
                />
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
              <div className="w-48">
                <label className="block text-sm font-medium mb-1">원점수 (0~100)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={grade1RawScores.english.raw}
                  onChange={(e) => handleGrade1RawScoreChange("english", "raw", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 한국사 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-green-500">📚</span> 한국사
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-48">
                <label className="block text-sm font-medium mb-1">원점수 (0~50)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="50"
                  value={grade1RawScores.koreanHistory.raw}
                  onChange={(e) => handleGrade1RawScoreChange("koreanHistory", "raw", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 통합과학 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-green-500">🔬</span> 통합과학
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-48">
                <label className="block text-sm font-medium mb-1">원점수 (0~50)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="50"
                  value={grade1RawScores.integratedScience.raw}
                  onChange={(e) => handleGrade1RawScoreChange("integratedScience", "raw", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 통합사회 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-purple-500">🏛️</span> 통합사회
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-48">
                <label className="block text-sm font-medium mb-1">원점수 (0~50)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="50"
                  value={grade1RawScores.integratedSocial.raw}
                  onChange={(e) => handleGrade1RawScoreChange("integratedSocial", "raw", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )

  // Grade 1 Standard Score Input Component
  const Grade1StandardScoreInput = () => (
    <div className="space-y-6">
      {/* Exam Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">모의고사 선택</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year-select">연도</Label>
              <Select
                value={grade1StandardScores.year}
                onValueChange={(value) => handleGrade1StandardExamChange("year", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="연도를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}년
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exam-select">모의고사</Label>
              <Select
                value={grade1StandardScores.exam}
                onValueChange={(value) => handleGrade1StandardExamChange("exam", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="모의고사를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {grade1MockExamOptions.map((exam) => (
                    <SelectItem key={exam} value={exam}>
                      {exam}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">성적 입력</CardTitle>
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant={grade1ScoreType === "raw" ? "default" : "outline"}
              className={grade1ScoreType === "raw" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
              onClick={() => setGrade1ScoreType("raw")}
            >
              원점수 입력
            </Button>
            <Button
              size="sm"
              className={grade1ScoreType === "standard" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
              variant={grade1ScoreType === "standard" ? "default" : "outline"}
              onClick={() => setGrade1ScoreType("standard")}
            >
              표준점수 입력
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 국어 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-orange-500">📝</span> 국어
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">표준점수 (0~200)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={grade1StandardScores.korean.standard}
                    onChange={(e) => handleGrade1StandardScoreChange("korean", "standard", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="1"
                    max="9"
                    value={grade1StandardScores.korean.grade}
                    onChange={(e) => handleGrade1StandardScoreChange("korean", "grade", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={grade1StandardScores.korean.percentile}
                    onChange={(e) => handleGrade1StandardScoreChange("korean", "percentile", e.target.value)}
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
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">표준점수 (0~200)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={grade1StandardScores.math.standard}
                    onChange={(e) => handleGrade1StandardScoreChange("math", "standard", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="1"
                    max="9"
                    value={grade1StandardScores.math.grade}
                    onChange={(e) => handleGrade1StandardScoreChange("math", "grade", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={grade1StandardScores.math.percentile}
                    onChange={(e) => handleGrade1StandardScoreChange("math", "percentile", e.target.value)}
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
                  value={grade1StandardScores.english.grade}
                  onChange={(e) => handleGrade1StandardScoreChange("english", "grade", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 한국사 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-green-500">📚</span> 한국사
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
                  value={grade1StandardScores.koreanHistory.grade}
                  onChange={(e) => handleGrade1StandardScoreChange("koreanHistory", "grade", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 통합과학 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-green-500">🔬</span> 통합과학
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">표준점수 (0~200)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={grade1StandardScores.integratedScience.standard}
                    onChange={(e) => handleGrade1StandardScoreChange("integratedScience", "standard", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="1"
                    max="9"
                    value={grade1StandardScores.integratedScience.grade}
                    onChange={(e) => handleGrade1StandardScoreChange("integratedScience", "grade", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={grade1StandardScores.integratedScience.percentile}
                    onChange={(e) => handleGrade1StandardScoreChange("integratedScience", "percentile", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 통합사회 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-purple-500">🏛️</span> 통합사회
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">표준점수 (0~200)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={grade1StandardScores.integratedSocial.standard}
                    onChange={(e) => handleGrade1StandardScoreChange("integratedSocial", "standard", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="1"
                    max="9"
                    value={grade1StandardScores.integratedSocial.grade}
                    onChange={(e) => handleGrade1StandardScoreChange("integratedSocial", "grade", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={grade1StandardScores.integratedSocial.percentile}
                    onChange={(e) => handleGrade1StandardScoreChange("integratedSocial", "percentile", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )

  // Grade 2 Raw Score Input Component
  const Grade2RawScoreInput = () => (
    <div className="space-y-6">
      {/* Exam Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">모의고사 선택</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year-select">연도</Label>
              <Select value={grade2RawScores.year} onValueChange={(value) => handleGrade2RawExamChange("year", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="연도를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}년
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exam-select">모의고사</Label>
              <Select value={grade2RawScores.exam} onValueChange={(value) => handleGrade2RawExamChange("exam", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="모의고사를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {grade1MockExamOptions.map((exam) => (
                    <SelectItem key={exam} value={exam}>
                      {exam}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">성적 입력</CardTitle>
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              className={grade2ScoreType === "raw" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
              variant={grade2ScoreType === "raw" ? "default" : "outline"}
              onClick={() => setGrade2ScoreType("raw")}
            >
              원점수 입력
            </Button>
            <Button
              size="sm"
              variant={grade2ScoreType === "standard" ? "default" : "outline"}
              className={grade2ScoreType === "standard" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
              onClick={() => setGrade2ScoreType("standard")}
            >
              표준점수 입력
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 국어 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-orange-500">📝</span> 국어
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-48">
                <label className="block text-sm font-medium mb-1">원점수 (0~100)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={grade2RawScores.korean.raw}
                  onChange={(e) => handleGrade2RawScoreChange("korean", "raw", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 수학 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-blue-500">📊</span> 수학
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-48">
                <label className="block text-sm font-medium mb-1">원점수 (0~100)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={grade2RawScores.math.raw}
                  onChange={(e) => handleGrade2RawScoreChange("math", "raw", e.target.value)}
                />
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
              <div className="w-48">
                <label className="block text-sm font-medium mb-1">원점수 (0~100)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={grade2RawScores.english.raw}
                  onChange={(e) => handleGrade2RawScoreChange("english", "raw", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 한국사 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-green-500">📚</span> 한국사
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-48">
                <label className="block text-sm font-medium mb-1">원점수 (0~50)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="50"
                  value={grade2RawScores.koreanHistory.raw}
                  onChange={(e) => handleGrade2RawScoreChange("koreanHistory", "raw", e.target.value)}
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
                  value={grade2RawScores.inquiry1?.subject || ""}
                  onValueChange={(value) => handleGrade2RawScoreChange("inquiry1", "subject", value)}
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
              <div className="w-48">
                <label className="block text-sm font-medium mb-1">원점수 (0~50)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="50"
                  value={grade2RawScores.inquiry1?.raw || ""}
                  onChange={(e) => handleGrade2RawScoreChange("inquiry1", "raw", e.target.value)}
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
                  value={grade2RawScores.inquiry2?.subject || ""}
                  onValueChange={(value) => handleGrade2RawScoreChange("inquiry2", "subject", value)}
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
              <div className="w-48">
                <label className="block text-sm font-medium mb-1">원점수 (0~50)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="50"
                  value={grade2RawScores.inquiry2?.raw || ""}
                  onChange={(e) => handleGrade2RawScoreChange("inquiry2", "raw", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )

  // Grade 2 Standard Score Input Component
  const Grade2StandardScoreInput = () => (
    <div className="space-y-6">
      {/* Exam Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">모의고사 선택</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year-select">연도</Label>
              <Select
                value={grade2StandardScores.year}
                onValueChange={(value) => handleGrade2StandardExamChange("year", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="연도를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}년
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exam-select">모의고사</Label>
              <Select
                value={grade2StandardScores.exam}
                onValueChange={(value) => handleGrade2StandardExamChange("exam", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="모의고사를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {grade1MockExamOptions.map((exam) => (
                    <SelectItem key={exam} value={exam}>
                      {exam}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">성적 입력</CardTitle>
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant={grade2ScoreType === "raw" ? "default" : "outline"}
              className={grade2ScoreType === "raw" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
              onClick={() => setGrade2ScoreType("raw")}
            >
              원점수 입력
            </Button>
            <Button
              size="sm"
              className={grade2ScoreType === "standard" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
              variant={grade2ScoreType === "standard" ? "default" : "outline"}
              onClick={() => setGrade2ScoreType("standard")}
            >
              표준점수 입력
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 국어 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-orange-500">📝</span> 국어
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">표준점수 (0~200)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={grade2StandardScores.korean.standard}
                    onChange={(e) => handleGrade2StandardScoreChange("korean", "standard", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="1"
                    max="9"
                    value={grade2StandardScores.korean.grade}
                    onChange={(e) => handleGrade2StandardScoreChange("korean", "grade", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={grade2StandardScores.korean.percentile}
                    onChange={(e) => handleGrade2StandardScoreChange("korean", "percentile", e.target.value)}
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
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">표준점수 (0~200)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={grade2StandardScores.math.standard}
                    onChange={(e) => handleGrade2StandardScoreChange("math", "standard", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="1"
                    max="9"
                    value={grade2StandardScores.math.grade}
                    onChange={(e) => handleGrade2StandardScoreChange("math", "grade", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={grade2StandardScores.math.percentile}
                    onChange={(e) => handleGrade2StandardScoreChange("math", "percentile", e.target.value)}
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
                  value={grade2StandardScores.english.grade}
                  onChange={(e) => handleGrade2StandardScoreChange("english", "grade", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 한국사 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-green-500">📚</span> 한국사
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
                  value={grade2StandardScores.koreanHistory.grade}
                  onChange={(e) => handleGrade2StandardScoreChange("koreanHistory", "grade", e.target.value)}
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
                  value={grade2StandardScores.inquiry1?.subject || ""}
                  onValueChange={(value) => handleGrade2StandardScoreChange("inquiry1", "subject", value)}
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
                    value={grade2StandardScores.inquiry1?.standard || ""}
                    onChange={(e) => handleGrade2StandardScoreChange("inquiry1", "standard", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="1"
                    max="9"
                    value={grade2StandardScores.inquiry1?.grade || ""}
                    onChange={(e) => handleGrade2StandardScoreChange("inquiry1", "grade", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={grade2StandardScores.inquiry1?.percentile || ""}
                    onChange={(e) => handleGrade2StandardScoreChange("inquiry1", "percentile", e.target.value)}
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
                  value={grade2StandardScores.inquiry2?.subject || ""}
                  onValueChange={(value) => handleGrade2StandardScoreChange("inquiry2", "subject", value)}
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
                    value={grade2StandardScores.inquiry2?.standard || ""}
                    onChange={(e) => handleGrade2StandardScoreChange("inquiry2", "standard", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="1"
                    max="9"
                    value={grade2StandardScores.inquiry2?.grade || ""}
                    onChange={(e) => handleGrade2StandardScoreChange("inquiry2", "grade", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={grade2StandardScores.inquiry2?.percentile || ""}
                    onChange={(e) => handleGrade2StandardScoreChange("inquiry2", "percentile", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )

  // Grade 3 Raw Score Input Component (정시합격예측 스타일)
  const Grade3RawScoreInput = () => (
    <div className="space-y-6">
      {/* Exam Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">모의고사 선택</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year-select">연도</Label>
              <Select value={grade3RawScores.year} onValueChange={(value) => handleGrade3RawExamChange("year", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="연도를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}년
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exam-select">모의고사</Label>
              <Select value={grade3RawScores.exam} onValueChange={(value) => handleGrade3RawExamChange("exam", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="모의고사를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {mockExamOptions.map((exam) => (
                    <SelectItem key={exam} value={exam}>
                      {exam}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">성적 입력</CardTitle>
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              className={grade3ScoreType === "raw" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
              variant={grade3ScoreType === "raw" ? "default" : "outline"}
              onClick={() => setGrade3ScoreType("raw")}
            >
              원점수 입력
            </Button>
            <Button
              size="sm"
              variant={grade3ScoreType === "standard" ? "default" : "outline"}
              className={grade3ScoreType === "standard" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
              onClick={() => setGrade3ScoreType("standard")}
            >
              표준점수 입력
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
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
                  className={
                    grade3RawScores.korean.selectedSubject === "화법" ? "bg-blue-500 text-white border-blue-500" : ""
                  }
                  onClick={() => handleGrade3RawScoreChange("korean", "selectedSubject", "화법")}
                >
                  화법
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={
                    grade3RawScores.korean.selectedSubject === "언어" ? "bg-blue-500 text-white border-blue-500" : ""
                  }
                  onClick={() => handleGrade3RawScoreChange("korean", "selectedSubject", "언어")}
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
                    value={grade3RawScores.korean.raw}
                    onChange={(e) => handleGrade3RawScoreChange("korean", "raw", e.target.value)}
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
                  className={
                    grade3RawScores.math.selectedSubject === "확률" ? "bg-blue-500 text-white border-blue-500" : ""
                  }
                  onClick={() => handleGrade3RawScoreChange("math", "selectedSubject", "확률")}
                >
                  확률
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={
                    grade3RawScores.math.selectedSubject === "기하" ? "bg-blue-500 text-white border-blue-500" : ""
                  }
                  onClick={() => handleGrade3RawScoreChange("math", "selectedSubject", "기하")}
                >
                  기하
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={
                    grade3RawScores.math.selectedSubject === "미분" ? "bg-blue-500 text-white border-blue-500" : ""
                  }
                  onClick={() => handleGrade3RawScoreChange("math", "selectedSubject", "미분")}
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
                    value={grade3RawScores.math.raw}
                    onChange={(e) => handleGrade3RawScoreChange("math", "raw", e.target.value)}
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
                  value={grade3RawScores.english.raw}
                  onChange={(e) => handleGrade3RawScoreChange("english", "raw", e.target.value)}
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
                  value={grade3RawScores.koreanHistory.raw}
                  onChange={(e) => handleGrade3RawScoreChange("koreanHistory", "raw", e.target.value)}
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
                  value={grade3RawScores.inquiry1.subject}
                  onValueChange={(value) => handleGrade3RawScoreChange("inquiry1", "subject", value)}
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
                  value={grade3RawScores.inquiry1.raw}
                  onChange={(e) => handleGrade3RawScoreChange("inquiry1", "raw", e.target.value)}
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
                  value={grade3RawScores.inquiry2.subject}
                  onValueChange={(value) => handleGrade3RawScoreChange("inquiry2", "subject", value)}
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
                  value={grade3RawScores.inquiry2.raw}
                  onChange={(e) => handleGrade3RawScoreChange("inquiry2", "raw", e.target.value)}
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
                      grade3RawScores.secondLanguage.category === subject
                        ? "bg-blue-500 text-white border-blue-500"
                        : ""
                    }
                    onClick={() => handleGrade3RawScoreChange("secondLanguage", "category", subject)}
                  >
                    {subject}
                  </Button>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  className={
                    grade3RawScores.secondLanguage.category === "기타" ? "bg-blue-500 text-white border-blue-500" : ""
                  }
                  onClick={() => handleGrade3RawScoreChange("secondLanguage", "category", "기타")}
                >
                  기타
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )

  // Grade 3 Standard Score Input Component (정시합격예측 스타일)
  const Grade3StandardScoreInput = () => (
    <div className="space-y-6">
      {/* Exam Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">모의고사 선택</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year-select">연도</Label>
              <Select
                value={grade3StandardScores.year}
                onValueChange={(value) => handleGrade3StandardExamChange("year", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="연도를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}년
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exam-select">모의고사</Label>
              <Select
                value={grade3StandardScores.exam}
                onValueChange={(value) => handleGrade3StandardExamChange("exam", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="모의고사를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {mockExamOptions.map((exam) => (
                    <SelectItem key={exam} value={exam}>
                      {exam}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">성적 입력</CardTitle>
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant={grade3ScoreType === "raw" ? "default" : "outline"}
              className={grade3ScoreType === "raw" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
              onClick={() => setGrade3ScoreType("raw")}
            >
              원점수 입력
            </Button>
            <Button
              size="sm"
              className={grade3ScoreType === "standard" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
              variant={grade3ScoreType === "standard" ? "default" : "outline"}
              onClick={() => setGrade3ScoreType("standard")}
            >
              표준점수 입력
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
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
                    value={grade3StandardScores.korean.standard}
                    onChange={(e) => handleGrade3StandardScoreChange("korean", "standard", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="1"
                    max="9"
                    value={grade3StandardScores.korean.grade}
                    onChange={(e) => handleGrade3StandardScoreChange("korean", "grade", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={grade3StandardScores.korean.percentile}
                    onChange={(e) => handleGrade3StandardScoreChange("korean", "percentile", e.target.value)}
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
                    value={grade3StandardScores.math.standard}
                    onChange={(e) => handleGrade3StandardScoreChange("math", "standard", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="1"
                    max="9"
                    value={grade3StandardScores.math.grade}
                    onChange={(e) => handleGrade3StandardScoreChange("math", "grade", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={grade3StandardScores.math.percentile}
                    onChange={(e) => handleGrade3StandardScoreChange("math", "percentile", e.target.value)}
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
                  value={grade3StandardScores.english.grade}
                  onChange={(e) => handleGrade3StandardScoreChange("english", "grade", e.target.value)}
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
                  value={grade3StandardScores.koreanHistory.grade}
                  onChange={(e) => handleGrade3StandardScoreChange("koreanHistory", "grade", e.target.value)}
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
                  value={grade3StandardScores.inquiry1.subject}
                  onValueChange={(value) => handleGrade3StandardScoreChange("inquiry1", "subject", value)}
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
                    value={grade3StandardScores.inquiry1.standard}
                    onChange={(e) => handleGrade3StandardScoreChange("inquiry1", "standard", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="1"
                    max="9"
                    value={grade3StandardScores.inquiry1.grade}
                    onChange={(e) => handleGrade3StandardScoreChange("inquiry1", "grade", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={grade3StandardScores.inquiry1.percentile}
                    onChange={(e) => handleGrade3StandardScoreChange("inquiry1", "percentile", e.target.value)}
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
                  value={grade3StandardScores.inquiry2.subject}
                  onValueChange={(value) => handleGrade3StandardScoreChange("inquiry2", "subject", value)}
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
                    value={grade3StandardScores.inquiry2.standard}
                    onChange={(e) => handleGrade3StandardScoreChange("inquiry2", "standard", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="1"
                    max="9"
                    value={grade3StandardScores.inquiry2.grade}
                    onChange={(e) => handleGrade3StandardScoreChange("inquiry2", "grade", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={grade3StandardScores.inquiry2.percentile}
                    onChange={(e) => handleGrade3StandardScoreChange("inquiry2", "percentile", e.target.value)}
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
                      grade3StandardScores.secondLanguage.category === subject
                        ? "bg-blue-500 text-white border-blue-500"
                        : ""
                    }
                    onClick={() => handleGrade3StandardScoreChange("secondLanguage", "category", subject)}
                  >
                    {subject}
                  </Button>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  className={
                    grade3StandardScores.secondLanguage.category === "기타"
                      ? "bg-blue-500 text-white border-blue-500"
                      : ""
                  }
                  onClick={() => handleGrade3StandardScoreChange("secondLanguage", "category", "기타")}
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
                  value={grade3StandardScores.secondLanguage.subject1}
                  onChange={(e) => handleGrade3StandardScoreChange("secondLanguage", "subject1", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    if (activeGrade === "grade1") {
      return grade1ScoreType === "raw" ? <Grade1RawScoreInput /> : <Grade1StandardScoreInput />
    } else if (activeGrade === "grade2") {
      return grade2ScoreType === "raw" ? <Grade2RawScoreInput /> : <Grade2StandardScoreInput />
    } else {
      return grade3ScoreType === "raw" ? <Grade3RawScoreInput /> : <Grade3StandardScoreInput />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600">
            <span>홈</span> <span className="mx-2">{">"}</span>
            <span>모의고사 분석</span> <span className="mx-2">{">"}</span>
            <span className="text-gray-900">성적입력</span>
          </div>

          {/* Grade Tabs */}
          <div className="mb-6">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={activeGrade === "grade1" ? "default" : "outline"}
                className={activeGrade === "grade1" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
                onClick={() => setActiveGrade("grade1")}
              >
                고1
              </Button>
              <Button
                size="sm"
                variant={activeGrade === "grade2" ? "default" : "outline"}
                className={activeGrade === "grade2" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
                onClick={() => setActiveGrade("grade2")}
              >
                고2
              </Button>
              <Button
                size="sm"
                variant={activeGrade === "grade3" ? "default" : "outline"}
                className={activeGrade === "grade3" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
                onClick={() => setActiveGrade("grade3")}
              >
                고3/재수
              </Button>
            </div>
          </div>

          {renderContent()}

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <Button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2">
              입력하기
            </Button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">학생 성적의 수집 및 활용에 동의합니다.</div>
        </div>
      </div>
    </div>
  )
}
