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
import { ISchoolRecordSelectSubject } from "@/stores/server/features/me/interfaces";
import { ITransformedSubjects } from "@/stores/server/features/static-data/queries";

export const SelectSubjectInputItem = React.memo(
  ({
    index,
    selectSubjectItem,
    onChangeSelectSubjectValue,
    subjects,
  }: {
    index: number;
    selectSubjectItem: Omit<ISchoolRecordSelectSubject, "id">;
    onChangeSelectSubjectValue: (
      index: number,
      type: string,
      value: string,
    ) => void;
    subjects: ITransformedSubjects;
  }) => {
    const getMainSubjectByCode = (code: string) => subjects.MAIN_SUBJECTS[code];
    const getSubjectByCode = (code: string) => subjects.SUBJECTS[code];

    return (
      <div className="flex items-center gap-2">
        <Select
          value={selectSubjectItem.semester || ""}
          onValueChange={(value) =>
            onChangeSelectSubjectValue(index, "semester", value)
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
          value={selectSubjectItem.mainSubjectCode || ""}
          onValueChange={(value) => {
            onChangeSelectSubjectValue(index, "mainSubjectCode", value);
            const mainSubject = getMainSubjectByCode(value);
            if (mainSubject) {
              onChangeSelectSubjectValue(
                index,
                "mainSubjectName",
                mainSubject.name,
              );
            }
          }}
        >
          <SelectTrigger className="min-w-[120px] max-w-[120px]">
            <SelectValue placeholder="교과 선택">
              {selectSubjectItem.mainSubjectCode 
                ? (getMainSubjectByCode(selectSubjectItem.mainSubjectCode)?.name || selectSubjectItem.mainSubjectName || selectSubjectItem.mainSubjectCode)
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
          value={selectSubjectItem.subjectCode || ""}
          onValueChange={(value) => {
            onChangeSelectSubjectValue(index, "subjectCode", value);
            const subject = getSubjectByCode(value);
            if (subject) {
              onChangeSelectSubjectValue(index, "subjectName", subject.name);
            }
          }}
        >
          <SelectTrigger className="min-w-[120px] max-w-[120px]">
            <SelectValue placeholder="과목 선택">
              {selectSubjectItem.subjectCode 
                ? (getSubjectByCode(selectSubjectItem.subjectCode)?.name || selectSubjectItem.subjectName || selectSubjectItem.subjectCode)
                : "과목 선택"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>세부과목 선택</SelectLabel>
              {selectSubjectItem.mainSubjectCode &&
                subjects.MAIN_SUBJECTS[
                  selectSubjectItem.mainSubjectCode
                ]?.subjectList.map((code) => (
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
          value={selectSubjectItem.unit || ""}
          onChange={(e) =>
            onChangeSelectSubjectValue(index, "unit", e.target.value)
          }
        />
        <Input
          className="min-w-[60px] max-w-[60px]"
          placeholder="원점수"
          type="text"
          value={selectSubjectItem.rawScore || ""}
          onChange={(e) =>
            onChangeSelectSubjectValue(index, "rawScore", e.target.value)
          }
        />
        <Input
          className="min-w-[60px] max-w-[60px]"
          placeholder="과목평균"
          type="text"
          value={selectSubjectItem.subSubjectAverage || ""}
          onChange={(e) =>
            onChangeSelectSubjectValue(
              index,
              "subSubjectAverage",
              e.target.value,
            )
          }
        />

        <Select
          value={selectSubjectItem.achievement || ""}
          onValueChange={(value) => {
            onChangeSelectSubjectValue(index, "achievement", value);
          }}
        >
          <SelectTrigger className="min-w-[60px] max-w-[60px]">
            <SelectValue placeholder="성취도" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>성취도</SelectLabel>
              {["A", "B", "C", "D", "E"].map((achievement) => (
                <SelectItem key={achievement + "normal"} value={achievement}>
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
          value={selectSubjectItem.studentsNum || ""}
          onChange={(e) =>
            onChangeSelectSubjectValue(index, "studentsNum", e.target.value)
          }
        />
        <Input
          className="min-w-[60px] max-w-[60px]"
          placeholder="A"
          type="text"
          value={selectSubjectItem.achievementa || ""}
          onChange={(e) =>
            onChangeSelectSubjectValue(index, "achievementa", e.target.value)
          }
        />
        <Input
          className="min-w-[60px] max-w-[60px]"
          placeholder="B"
          type="text"
          value={selectSubjectItem.achievementb || ""}
          onChange={(e) =>
            onChangeSelectSubjectValue(index, "achievementb", e.target.value)
          }
        />
        <Input
          className="min-w-[60px] max-w-[60px]"
          placeholder="C"
          type="text"
          value={selectSubjectItem.achievementc || ""}
          onChange={(e) =>
            onChangeSelectSubjectValue(index, "achievementc", e.target.value)
          }
        />
      </div>
    );
  },
);
