/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useResumeStore } from "../store/useResumeStore";

interface EducationItem {
    title: string;
    period: string;
    major: string;
}


interface EducationProps {
  educations: EducationItem[];
  setEducations: (edus: EducationItem[]) => void;
}

export default function Education({ educations, setEducations }: EducationProps) {
    // const [educations, setEducations] = useState<EducationItem[]>([]);
    const [currentEdu, setCurrentEdu] = useState<EducationItem>({
        title: "",
        period: "",
        major: "",
    });

    // 경력 입력 변경
    const handleEduChange = (field: keyof EducationItem, value: string) => {
        setCurrentEdu((prev) => ({ ...prev, [field]: value }));
    };

    const addEducation = () => {
        if (
            !currentEdu.title.trim() ||
            !currentEdu.period.trim() ||
            !currentEdu.major.trim()
        ) {
            alert("모든 경력 항목을 입력해주세요.");
            return;
        }
        setEducations([...educations, currentEdu]); 
        setCurrentEdu({ title: "", period: "", major: "" });
    };


    const handleDeleteEducation = (index: number) => {
        setEducations(educations.filter((_, i) => i !== index));
    };

    useEffect(() => {
        useResumeStore.getState().loadFromStorage();
    }, []);

    return (
        <>
            {/* 학력 입력폼 */}
            <div className="border border-gray-300 rounded-lg p-5 space-y-4">
                <h2 className="text-xl font-semibold mb-4">학력 추가</h2>
                <input
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    placeholder="학교명"
                    value={currentEdu.title}
                    onChange={(e) => handleEduChange("title", e.target.value)}
                />
                <input
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    placeholder="기간"
                    value={currentEdu.period}
                    onChange={(e) => handleEduChange("period", e.target.value)}
                />
                <input
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    placeholder="학과"
                    value={currentEdu.major}
                    onChange={(e) => handleEduChange("major", e.target.value)}
                />
                <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={addEducation}
                >
                    학력 추가
                </button>
            </div>
            {/* 학력 리스트 */}
                    {educations.length > 0 && (
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold mb-2">추가된 학력</h2>
                            <ul className="list-disc list-inside space-y-2">
                                {educations.map((exp, idx) => (
                                    <li key={idx} className="flex justify-between items-center">
                                        <div>
                                            {exp.title} ({exp.period}) {exp.major}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteEducation(idx)}
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
