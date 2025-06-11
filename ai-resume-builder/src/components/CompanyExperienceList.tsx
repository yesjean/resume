import React from "react";

interface CompanyExperienceData {
  companyName: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
}

interface Props {
  experiences: CompanyExperienceData[];
  setExperiences: (data: CompanyExperienceData[]) => void;
}

export default function CompanyExperienceList({ experiences, setExperiences }: Props) {
  // 입력 변경 핸들러
  const handleChange = (index: number, field: keyof CompanyExperienceData, value: string | boolean) => {
    const newExperiences = [...experiences];
    newExperiences[index] = { ...newExperiences[index], [field]: value };

    // 만약 currentlyWorking이 true면 endDate는 빈 문자열로 처리
    if (field === "currentlyWorking" && value === true) {
      newExperiences[index].endDate = "";
    }
    setExperiences(newExperiences);
  };

  // 새 항목 추가
  const handleAdd = () => {
    setExperiences([
      ...experiences,
      {
        companyName: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
      },
    ]);
  };

  // 항목 삭제
  const handleDelete = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {experiences.map((exp, idx) => (
        <div key={idx} className="p-4 border rounded-md space-y-2">
          <input
            type="text"
            placeholder="회사명"
            value={exp.companyName}
            onChange={(e) => handleChange(idx, "companyName", e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
          <div className="flex space-x-2 items-center">
            <input
              type="month"
              value={exp.startDate}
              onChange={(e) => handleChange(idx, "startDate", e.target.value)}
              className="border rounded px-2 py-1"
            />
            <span>~</span>
            <input
              type="month"
              value={exp.endDate}
              onChange={(e) => handleChange(idx, "endDate", e.target.value)}
              disabled={exp.currentlyWorking}
              className="border rounded px-2 py-1"
              placeholder={exp.currentlyWorking ? "재직중" : ""}
            />
          </div>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={exp.currentlyWorking}
              onChange={(e) => handleChange(idx, "currentlyWorking", e.target.checked)}
            />
            <span>재직중</span>
          </label>
          <button
            onClick={() => handleDelete(idx)}
            className="text-red-500 hover:underline text-sm"
          >
            삭제
          </button>
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="w-full py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        경력 추가
      </button>
    </div>
  );
}
