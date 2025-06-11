/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useResumeStore } from "../store/useResumeStore";
interface CompanyExperienceItem {
  companyName: string
  startDate: string
  endDate: string
  currentlyWorking: boolean
  position: string
  description: string
}

interface CompanyExperienceProps {
  companyExperiences: CompanyExperienceItem[];
  setCompanyExperiences: (CompanyExperience: CompanyExperienceItem[]) => void;
}


export default function CompanyExperience({ companyExperiences, setCompanyExperiences }: CompanyExperienceProps) {
  // const [CompanyExperiences, setCompanyExperiences] = useState<CompanyExperienceItem[]>([]);
  const [currentCompany, setCurrentCompany] = useState<CompanyExperienceItem>({
    companyName: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    position: '',
    description: '',
  });

  // 자격증 입력 변경
  const handleCompanyChange = (field: keyof CompanyExperienceItem, value: string | boolean) => {
    setCurrentCompany((prev) => ({ ...prev, [field]: value }));
  };

  const addCompanyExperience = () => {
    if (
      !currentCompany.companyName.trim() ||
      !currentCompany.startDate.trim() ||
      (!currentCompany.currentlyWorking && !currentCompany.endDate.trim()) ||  // 재직중 아니면 endDate 필수
      !currentCompany.position.trim() ||
      !currentCompany.description.trim()
    ) {
      alert("모든 경력 항목을 입력해주세요.");
      return;
    }
    setCompanyExperiences([...companyExperiences, currentCompany]);
    setCurrentCompany({ companyName: "", startDate: "", endDate: "", currentlyWorking: false, position: '', description: '' });
  };


  const handleDeleteCompanyExperience = (index: number) => {
    setCompanyExperiences(companyExperiences.filter((_, i) => i !== index));
  };


  useEffect(() => {
    useResumeStore.getState().loadFromStorage();
  }, []);

  return (
    <>
      <div className="border border-gray-300 rounded-lg p-5 space-y-4 mt-8">
        <h2 className="text-xl font-semibold mb-4">경력 추가</h2>
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="회사명"
          value={currentCompany.companyName}
          onChange={(e) => handleCompanyChange("companyName", e.target.value)}
        />

        <div className="flex gap-4 items-end">
          {/* 입사일 */}
          <div className="w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">입사일</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={currentCompany.startDate}
              onChange={(e) => handleCompanyChange("startDate", e.target.value)}
            />
          </div>

          {/* 퇴사일 */}
          <div className="w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">퇴사일</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={currentCompany.endDate}
              onChange={(e) => handleCompanyChange("endDate", e.target.value)}
              disabled={currentCompany.currentlyWorking}
            />
          </div>

          {/* 재직중 */}
          <div className="w-1/3 flex items-center mb-3 space-x-2">
            <label htmlFor="currentlyWorking" className="text-sm text-gray-700">
              재직중
            </label>
            <input
              id="currentlyWorking"
              type="checkbox"
              checked={currentCompany.currentlyWorking}
              onChange={(e) =>
                setCurrentCompany((prev) => ({
                  ...prev,
                  currentlyWorking: e.target.checked,
                  endDate: e.target.checked ? "" : prev.endDate,
                }))
              }
              className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>


        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="직급"
          value={currentCompany.position}
          onChange={(e) => handleCompanyChange("position", e.target.value)}
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="담당업무"
          value={currentCompany.description}
          onChange={(e) => handleCompanyChange("description", e.target.value)}
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={addCompanyExperience}
        >
          경력 추가
        </button>
      </div>
      {/* 자격증 리스트 */}
      {companyExperiences.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">추가된 자격증</h2>
          <ul className="list-disc list-inside space-y-1">
            {companyExperiences.map((exp, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <div>
                  {exp.companyName} (
                  {exp.startDate} ~ {exp.currentlyWorking ? "재직중" : exp.endDate}
                  ) {exp.position}
                </div>

                <button
                  onClick={() => handleDeleteCompanyExperience(idx)}
                  className="text-red-500 hover:underline text-sm ml-4"
                >
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
