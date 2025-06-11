/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useResumeStore } from "../store/useResumeStore";
interface CertificationItem {
    title: string;
    date: string;
}

interface CertificationProps {
  certifications: CertificationItem[];
  setCertifications: (certification: CertificationItem[]) => void;
}


export default function Certification({ certifications, setCertifications }: CertificationProps) {
    // const [certifications, setCertifications] = useState<CertificationItem[]>([]);
    const [currentCert, setCurrentCert] = useState<CertificationItem>({
        title: "",
        date: "",
    });

    // 자격증 입력 변경
    const handleCertChange = (field: keyof CertificationItem, value: string) => {
        setCurrentCert((prev) => ({ ...prev, [field]: value }));
    };

    const addCertification = () => {
        if (!currentCert.title.trim() || !currentCert.date.trim()) {
            alert("모든 자격증 항목을 입력해주세요.");
            return;
        }
        setCertifications([...certifications, currentCert]); 
        setCurrentCert({ title: "", date: "" });
    };


    const handleDeleteCertification = (index: number) => {
        setCertifications(certifications.filter((_, i) => i !== index));
    };


    useEffect(() => {
        useResumeStore.getState().loadFromStorage();
    }, []);

    return (<>
        <div className="border border-gray-300 rounded-lg p-5 space-y-4 mt-8">
            <h2 className="text-xl font-semibold mb-4">자격증 추가</h2>
            <input
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="자격증 명"
                value={currentCert.title}
                onChange={(e) => handleCertChange("title", e.target.value)}
            />
            <input
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="취득일 (예: 2023-05)"
                value={currentCert.date}
                onChange={(e) => handleCertChange("date", e.target.value)}
            />
            <button
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={addCertification}
            >
                자격증 추가
            </button>
        </div>
        {/* 자격증 리스트 */}
        {certifications.length > 0 && (
            <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2">추가된 자격증</h2>
                <ul className="list-disc list-inside space-y-1">
                    {certifications.map((exp, idx) => (
                        <li key={idx} className="flex justify-between items-center">
                            <div>
                                {exp.title} ({exp.date})
                            </div>

                            <button
                                onClick={() => handleDeleteCertification(idx)}
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
