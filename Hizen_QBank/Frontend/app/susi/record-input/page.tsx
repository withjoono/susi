"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Minus, Upload, FileText } from "lucide-react"

interface AttendanceRecord {
  year: number
  schoolDays: number
  absence: number
  absenceDays: number
  absenceOther: number
  absenceTotal: number
  lateLeave: number
  lateLeaveOther: number
  lateLeaveTotal: number
  earlyLeave: number
  earlyLeaveOther: number
  earlyLeaveTotal: number
  result: number
  resultOther: number
}

interface SubjectRecord {
  semester: string
  subject: string
  course: string
  credits: number
  achievement: string
  average: number
  stdDev: number
  grade: string
  students: number
  rank: string
}

export default function RecordInputPage() {
  const [activeGrade, setActiveGrade] = useState<"1학년" | "2학년" | "3학년">("1학년")
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    공통과목: true,
    진로선택과목: true,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      year: 1,
      schoolDays: 0,
      absence: 0,
      absenceDays: 0,
      absenceOther: 0,
      absenceTotal: 0,
      lateLeave: 0,
      lateLeaveOther: 0,
      lateLeaveTotal: 0,
      earlyLeave: 0,
      earlyLeaveOther: 0,
      earlyLeaveTotal: 0,
      result: 0,
      resultOther: 0,
    },
  ])

  const [commonSubjects, setCommonSubjects] = useState<SubjectRecord[]>([])
  const [careerSubjects, setCareerSubjects] = useState<SubjectRecord[]>([])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const addSubjectRecord = (type: "common" | "career") => {
    const newRecord: SubjectRecord = {
      semester: "",
      subject: "",
      course: "",
      credits: 0,
      achievement: "",
      average: 0,
      stdDev: 0,
      grade: "",
      students: 0,
      rank: "",
    }

    if (type === "common") {
      setCommonSubjects((prev) => [...prev, newRecord])
    } else {
      setCareerSubjects((prev) => [...prev, newRecord])
    }
  }

  const removeSubjectRecord = (type: "common" | "career", index: number) => {
    if (type === "common") {
      setCommonSubjects((prev) => prev.filter((_, i) => i !== index))
    } else {
      setCareerSubjects((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const updateAttendanceRecord = (index: number, field: keyof AttendanceRecord, value: number) => {
    setAttendanceRecords((prev) => prev.map((record, i) => (i === index ? { ...record, [field]: value } : record)))
  }

  const updateSubjectRecord = (type: "common" | "career", index: number, field: keyof SubjectRecord, value: any) => {
    if (type === "common") {
      setCommonSubjects((prev) => prev.map((record, i) => (i === index ? { ...record, [field]: value } : record)))
    } else {
      setCareerSubjects((prev) => prev.map((record, i) => (i === index ? { ...record, [field]: value } : record)))
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleFileUpload = () => {
    if (selectedFile) {
      setUploadedFiles((prev) => [...prev, selectedFile])
      setSelectedFile(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">생기부 입력</h1>

          {/* File Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="file-input">
                  <Button
                    variant="outline"
                    className="bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                    onClick={() => document.getElementById("file-input")?.click()}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    파일 선택
                  </Button>
                </label>
                <input id="file-input" type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
                <span className="text-gray-600">{selectedFile ? selectedFile.name : "선택된 파일 없음"}</span>
              </div>
              <Button
                onClick={handleFileUpload}
                disabled={!selectedFile}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
              >
                업로드
              </Button>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">업로드된 파일 목록</h3>
              {uploadedFiles.length === 0 ? (
                <p className="text-gray-500 text-sm">아직 업로드된 파일이 없어요 😊</p>
              ) : (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">성적 입력</h2>
          <p className="text-gray-600 mb-4">
            아래의 항목에 맞게 생기부를 입력해주세요!
            <br />
            필드 형식이 다르거나 변경에서 원인과 경우 계산식에서 제외되니 다시 한번 확인해주세요.
          </p>

          {/* Grade Tabs */}
          <div className="flex space-x-2 mb-6">
            {["1학년", "2학년", "3학년"].map((grade) => (
              <Button
                key={grade}
                variant={activeGrade === grade ? "default" : "outline"}
                onClick={() => setActiveGrade(grade as "1학년" | "2학년" | "3학년")}
                className={activeGrade === grade ? "bg-blue-500 hover:bg-blue-600" : ""}
              >
                {grade}
              </Button>
            ))}
          </div>
        </div>

        {/* Attendance Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">출결</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-sm font-medium text-gray-700">학년</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">수업일수</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">결석</th>
                  <th className="text-left p-2 text-sm font-medium text-blue-600">결석일수</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">기타</th>
                  <th className="text-left p-2 text-sm font-medium text-blue-600">결석</th>
                  <th className="text-left p-2 text-sm font-medium text-blue-600">지각/부득</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">기타</th>
                  <th className="text-left p-2 text-sm font-medium text-blue-600">결석</th>
                  <th className="text-left p-2 text-sm font-medium text-blue-600">조퇴/부득</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">기타</th>
                  <th className="text-left p-2 text-sm font-medium text-blue-600">결석</th>
                  <th className="text-left p-2 text-sm font-medium text-blue-600">결과/부득</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-700">기타</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{record.year}</td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={record.schoolDays}
                        onChange={(e) =>
                          updateAttendanceRecord(index, "schoolDays", Number.parseInt(e.target.value) || 0)
                        }
                        className="w-16 h-8 text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={record.absence}
                        onChange={(e) => updateAttendanceRecord(index, "absence", Number.parseInt(e.target.value) || 0)}
                        className="w-16 h-8 text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={record.absenceDays}
                        onChange={(e) =>
                          updateAttendanceRecord(index, "absenceDays", Number.parseInt(e.target.value) || 0)
                        }
                        className="w-16 h-8 text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={record.absenceOther}
                        onChange={(e) =>
                          updateAttendanceRecord(index, "absenceOther", Number.parseInt(e.target.value) || 0)
                        }
                        className="w-16 h-8 text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={record.absenceTotal}
                        onChange={(e) =>
                          updateAttendanceRecord(index, "absenceTotal", Number.parseInt(e.target.value) || 0)
                        }
                        className="w-16 h-8 text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={record.lateLeave}
                        onChange={(e) =>
                          updateAttendanceRecord(index, "lateLeave", Number.parseInt(e.target.value) || 0)
                        }
                        className="w-16 h-8 text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={record.lateLeaveOther}
                        onChange={(e) =>
                          updateAttendanceRecord(index, "lateLeaveOther", Number.parseInt(e.target.value) || 0)
                        }
                        className="w-16 h-8 text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={record.lateLeaveTotal}
                        onChange={(e) =>
                          updateAttendanceRecord(index, "lateLeaveTotal", Number.parseInt(e.target.value) || 0)
                        }
                        className="w-16 h-8 text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={record.earlyLeave}
                        onChange={(e) =>
                          updateAttendanceRecord(index, "earlyLeave", Number.parseInt(e.target.value) || 0)
                        }
                        className="w-16 h-8 text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={record.earlyLeaveOther}
                        onChange={(e) =>
                          updateAttendanceRecord(index, "earlyLeaveOther", Number.parseInt(e.target.value) || 0)
                        }
                        className="w-16 h-8 text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={record.earlyLeaveTotal}
                        onChange={(e) =>
                          updateAttendanceRecord(index, "earlyLeaveTotal", Number.parseInt(e.target.value) || 0)
                        }
                        className="w-16 h-8 text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={record.result}
                        onChange={(e) => updateAttendanceRecord(index, "result", Number.parseInt(e.target.value) || 0)}
                        className="w-16 h-8 text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={record.resultOther}
                        onChange={(e) =>
                          updateAttendanceRecord(index, "resultOther", Number.parseInt(e.target.value) || 0)
                        }
                        className="w-16 h-8 text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Common Subjects Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">공통과목 / 일반선택과목 / 전문교과I / 전문교과II</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => toggleSection("공통과목")} className="p-1">
                {expandedSections["공통과목"] ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSubjectRecord("common")}
                className="p-1 bg-blue-500 text-white hover:bg-blue-600"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">석차 등급이 없는 교과의 경우 석차등급을 비워두시면 됩니다</p>

          {expandedSections["공통과목"] && (
            <div className="space-y-4">
              <div className="grid grid-cols-10 gap-2 text-sm font-medium text-blue-600 border-b pb-2">
                <div>학기</div>
                <div>교과</div>
                <div>과목</div>
                <div>단위수</div>
                <div>성취수</div>
                <div>과목평균</div>
                <div>표준편차</div>
                <div>성취도</div>
                <div>수강자수</div>
                <div>석차등급</div>
              </div>

              {commonSubjects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">우측 플러스 버튼을 눌러 과목을 추가해주세요 😊</div>
              ) : (
                commonSubjects.map((subject, index) => (
                  <div key={index} className="grid grid-cols-10 gap-2 items-center">
                    <Input
                      value={subject.semester}
                      onChange={(e) => updateSubjectRecord("common", index, "semester", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="1-1"
                    />
                    <Input
                      value={subject.subject}
                      onChange={(e) => updateSubjectRecord("common", index, "subject", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="국어"
                    />
                    <Input
                      value={subject.course}
                      onChange={(e) => updateSubjectRecord("common", index, "course", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="국어"
                    />
                    <Input
                      type="number"
                      value={subject.credits}
                      onChange={(e) =>
                        updateSubjectRecord("common", index, "credits", Number.parseInt(e.target.value) || 0)
                      }
                      className="h-8 text-sm"
                    />
                    <Input
                      value={subject.achievement}
                      onChange={(e) => updateSubjectRecord("common", index, "achievement", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="A"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={subject.average}
                      onChange={(e) =>
                        updateSubjectRecord("common", index, "average", Number.parseFloat(e.target.value) || 0)
                      }
                      className="h-8 text-sm"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={subject.stdDev}
                      onChange={(e) =>
                        updateSubjectRecord("common", index, "stdDev", Number.parseFloat(e.target.value) || 0)
                      }
                      className="h-8 text-sm"
                    />
                    <Input
                      value={subject.grade}
                      onChange={(e) => updateSubjectRecord("common", index, "grade", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="1"
                    />
                    <Input
                      type="number"
                      value={subject.students}
                      onChange={(e) =>
                        updateSubjectRecord("common", index, "students", Number.parseInt(e.target.value) || 0)
                      }
                      className="h-8 text-sm"
                    />
                    <div className="flex items-center space-x-1">
                      <Input
                        value={subject.rank}
                        onChange={(e) => updateSubjectRecord("common", index, "rank", e.target.value)}
                        className="h-8 text-sm flex-1"
                        placeholder="1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSubjectRecord("common", index)}
                        className="p-1 h-8 w-8"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Career Subjects Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">진로선택과목</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => toggleSection("진로선택과목")} className="p-1">
                {expandedSections["진로선택과목"] ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSubjectRecord("career")}
                className="p-1 bg-blue-500 text-white hover:bg-blue-600"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {expandedSections["진로선택과목"] && (
            <div className="space-y-4">
              <div className="grid grid-cols-10 gap-2 text-sm font-medium text-blue-600 border-b pb-2">
                <div>학기</div>
                <div>교과</div>
                <div>과목</div>
                <div>단위수</div>
                <div>성취수</div>
                <div>과목평균</div>
                <div>성취도</div>
                <div>수강자수</div>
                <div>성취도별 분포비율(A,B,C)</div>
              </div>

              {careerSubjects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">우측 플러스 버튼을 눌러 과목을 추가해주세요 😊</div>
              ) : (
                careerSubjects.map((subject, index) => (
                  <div key={index} className="grid grid-cols-10 gap-2 items-center">
                    <Input
                      value={subject.semester}
                      onChange={(e) => updateSubjectRecord("career", index, "semester", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="1-1"
                    />
                    <Input
                      value={subject.subject}
                      onChange={(e) => updateSubjectRecord("career", index, "subject", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="국어"
                    />
                    <Input
                      value={subject.course}
                      onChange={(e) => updateSubjectRecord("career", index, "course", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="국어"
                    />
                    <Input
                      type="number"
                      value={subject.credits}
                      onChange={(e) =>
                        updateSubjectRecord("career", index, "credits", Number.parseInt(e.target.value) || 0)
                      }
                      className="h-8 text-sm"
                    />
                    <Input
                      value={subject.achievement}
                      onChange={(e) => updateSubjectRecord("career", index, "achievement", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="A"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={subject.average}
                      onChange={(e) =>
                        updateSubjectRecord("career", index, "average", Number.parseFloat(e.target.value) || 0)
                      }
                      className="h-8 text-sm"
                    />
                    <Input
                      value={subject.grade}
                      onChange={(e) => updateSubjectRecord("career", index, "grade", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="A"
                    />
                    <Input
                      type="number"
                      value={subject.students}
                      onChange={(e) =>
                        updateSubjectRecord("career", index, "students", Number.parseInt(e.target.value) || 0)
                      }
                      className="h-8 text-sm"
                    />
                    <Input
                      value={subject.rank}
                      onChange={(e) => updateSubjectRecord("career", index, "rank", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="30,40,30"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSubjectRecord("career", index)}
                      className="p-1 h-8 w-8"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <Button variant="outline" className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200">
            <Upload className="h-4 w-4" />
            <span>AI 생기부 성적 불러오기 (PDF만 가능)</span>
          </Button>

          <Button className="bg-blue-500 hover:bg-blue-600 px-8">저장하기</Button>
        </div>

        <div className="mt-4 text-sm text-gray-600 text-center">
          AI 생기부 성적 불러오기 기능은 성적만 불러오기 때문에 출결과 창체 정보는 직접 입력해주세요
          <br />
          성적 불러오기 후 누락된 과목 및 성적을 수정하고 저장하기 버튼을 눌러주세요
        </div>
      </div>
    </div>
  )
}
