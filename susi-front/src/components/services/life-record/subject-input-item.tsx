import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ISchoolRecordSubject } from "@/stores/server/features/me/interfaces";
import { ITransformedSubjects } from "@/stores/server/features/static-data/queries";

export const SubjectInputItem = React.memo(
  ({
    index,
    subjectItem,
    onChangeSubjectValue,
    subjects,
  }: {
    index: number;
    subjectItem: Omit<ISchoolRecordSubject, "id">;
    onChangeSubjectValue: (index: number, type: string, value: string) => void;
    subjects: ITransformedSubjects;
  }) => {
    const getMainSubjectByCode = (code: string) => subjects.MAIN_SUBJECTS[code];
    const getSubjectByCode = (code: string) => subjects.SUBJECTS[code];

    // Debug logging
    if (index === 0) {
      console.log('[SubjectInputItem] subjectItem:', subjectItem);
      console.log('[SubjectInputItem] mainSubjectCode:', subjectItem.mainSubjectCode);
      console.log('[SubjectInputItem] subjectCode:', subjectItem.subjectCode);
      console.log('[SubjectInputItem] MAIN_SUBJECTS has key?:', subjects.MAIN_SUBJECTS[subjectItem.mainSubjectCode || '']);
      console.log('[SubjectInputItem] MAIN_SUBJECTS keys count:', Object.keys(subjects.MAIN_SUBJECTS).length);
    }

    return (
      <div className="flex items-center gap-2">
        <Select
          value={subjectItem.semester || ""}
          onValueChange={(value) =>
            onChangeSubjectValue(index, "semester", value)
          }
        >
          <SelectTrigger className="min-w-[80px] max-w-[80px]">
            <SelectValue placeholder="학기 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>학기 선택</SelectLabel>
              <SelectItem value="1">1학기</SelectItem>
              <SelectItem value="2">2학기</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={subjectItem.mainSubjectCode || ""}
          onValueChange={(value) => {
            onChangeSubjectValue(index, "mainSubjectCode", value);
            const mainSubject = getMainSubjectByCode(value);
            if (mainSubject) {
              onChangeSubjectValue(
                index,
                "mainSubjectName",
                mainSubject.name,
              );
            }
          }}
        >
          <SelectTrigger className="min-w-[120px] max-w-[120px]">
            <SelectValue placeholder="교과 선택">
              {subjectItem.mainSubjectCode 
                ? (getMainSubjectByCode(subjectItem.mainSubjectCode)?.name || subjectItem.mainSubjectName || subjectItem.mainSubjectCode)
                : "교과 선택"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>교과 선택</SelectLabel>
              {Object.keys(subjects.MAIN_SUBJECTS).map((key) => (
                <SelectItem key={key} value={key}>
                  {subjects.MAIN_SUBJECTS[key].name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={subjectItem.subjectCode || ""}
          onValueChange={(value) => {
            onChangeSubjectValue(index, "subjectCode", value);
            const subject = getSubjectByCode(value);
            if (subject) {
              onChangeSubjectValue(index, "subjectName", subject.name);
            }
          }}
        >
          <SelectTrigger className="min-w-[120px] max-w-[120px]">
            <SelectValue placeholder="과목 선택">
              {subjectItem.subjectCode 
                ? (getSubjectByCode(subjectItem.subjectCode)?.name || subjectItem.subjectName || subjectItem.subjectCode)
                : "과목 선택"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>세부과목 선택</SelectLabel>
              {subjectItem.mainSubjectCode &&
                subjects.MAIN_SUBJECTS[
                  subjectItem.mainSubjectCode
                ]?.subjectList
                  .filter((code) => subjects.SUBJECTS[code].courseType !== 2)
                  .map((code) => (
                    <SelectItem key={code} value={code}>
                      {subjects.SUBJECTS[code].name}
                    </SelectItem>
                  ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Input
          className="min-w-[60px] max-w-[60px]"
          placeholder="단위수"
          type="text"
          value={subjectItem.unit || ""}
          onChange={(e) => onChangeSubjectValue(index, "unit", e.target.value)}
        />
        <Input
          className="min-w-[60px] max-w-[60px]"
          placeholder="원점수"
          type="text"
          value={subjectItem.rawScore || ""}
          onChange={(e) =>
            onChangeSubjectValue(index, "rawScore", e.target.value)
          }
        />
        <Input
          className="min-w-[60px] max-w-[60px]"
          placeholder="과목평균"
          type="text"
          value={subjectItem.subSubjectAverage || ""}
          onChange={(e) =>
            onChangeSubjectValue(index, "subSubjectAverage", e.target.value)
          }
        />
        <Input
          className="min-w-[60px] max-w-[60px]"
          placeholder="표준편차"
          type="text"
          value={subjectItem.standardDeviation || ""}
          onChange={(e) =>
            onChangeSubjectValue(index, "standardDeviation", e.target.value)
          }
        />

        <Select
          value={subjectItem.achievement || ""}
          onValueChange={(value) => {
            onChangeSubjectValue(index, "achievement", value);
          }}
        >
          <SelectTrigger className="min-w-[60px] max-w-[60px]">
            <SelectValue placeholder="성취도" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>성취도</SelectLabel>
              {["A", "B", "C", "D", "E"].map((achievement) => (
                <SelectItem key={achievement} value={achievement}>
                  {achievement}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          className="min-w-[60px] max-w-[60px]"
          placeholder="수강자수"
          type="text"
          value={subjectItem.studentsNum || ""}
          onChange={(e) =>
            onChangeSubjectValue(index, "studentsNum", e.target.value)
          }
        />
        <Input
          className="min-w-[60px] max-w-[60px]"
          placeholder="석차등급"
          type="text"
          value={subjectItem.ranking || ""}
          onChange={(e) =>
            onChangeSubjectValue(index, "ranking", e.target.value)
          }
        />
      </div>
    );
  },
);
