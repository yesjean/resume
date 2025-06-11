// Experience.tsx
import { useState } from "react";

interface ExperienceItem {
  title: string;
  period: string;
  activities: string;
  learnings: string;
}

interface ExperienceProps {
  experiences: ExperienceItem[];
  setExperiences: (experience: ExperienceItem[]) => void;
}

export default function Experience({ experiences, setExperiences }: ExperienceProps) {
  const [currentExp, setCurrentExp] = useState<ExperienceItem>({
    title: "",
    period: "",
    activities: "",
    learnings: "",
  });

  const handleExpChange = (field: keyof ExperienceItem, value: string) => {
    setCurrentExp((prev) => ({ ...prev, [field]: value }));
  };

  const addExperience = () => {
    if (
      !currentExp.title.trim() ||
      !currentExp.period.trim() ||
      !currentExp.activities.trim() ||
      !currentExp.learnings.trim()
    ) {
      alert("모든 경력 항목을 입력해주세요.");
      return;
    }
    setExperiences([...experiences, currentExp]); 
    setCurrentExp({ title: "", period: "", activities: "", learnings: "" });
  };

  const handleDeleteExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="border border-gray-300 rounded-lg p-5 space-y-4">
        <h2 className="text-xl font-semibold mb-4">프로젝트 추가</h2>
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="프로젝트 제목"
          value={currentExp.title}
          onChange={(e) => handleExpChange("title", e.target.value)}
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="기간"
          value={currentExp.period}
          onChange={(e) => handleExpChange("period", e.target.value)}
        />
        <textarea
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="주요 업무 및 활동"
          value={currentExp.activities}
          onChange={(e) => handleExpChange("activities", e.target.value)}
        />
        <textarea
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="배운 점"
          value={currentExp.learnings}
          onChange={(e) => handleExpChange("learnings", e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg" onClick={addExperience}>
          프로젝트 추가
        </button>
      </div>

      {experiences.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">추가된 프로젝트</h2>
          <ul className="space-y-2">
            {experiences.map((exp, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <div>{exp.title} ({exp.period})</div>
                <button onClick={() => handleDeleteExperience(idx)} className="text-red-500 text-sm">
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
