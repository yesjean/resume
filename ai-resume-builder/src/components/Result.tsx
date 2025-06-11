/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useResumeStore } from "../store/useResumeStore";
import { Copy } from "lucide-react";
import DocxExportButton from "../components/DocxExportButton";
interface Result {
    introduction: string;
    experience: string;
    certifications?: string; // 필요시
}

export default function Result({ activeTab, result }: {
    activeTab: string,
    result: Result
}) {
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // 복사 버튼 클릭 핸들러
    const handleCopy = (type: string) => {
        if (!result) return;
        let textToCopy = "";
        if (type === "introduce") {
            textToCopy = result.introduction;
        } else if (type === "experience") {
            textToCopy = result.experience;
        } else if (type === "certification") {
            textToCopy = result.certifications || "";
        }
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    useEffect(() => {
        useResumeStore.getState().loadFromStorage();
    }, []);

    return (<>

        {/* 결과 영역 */}
        {error && (
            <p className="text-center text-red-500 font-semibold">{error}</p>
        )}

        {result && (
            <div className="mt-10 border border-gray-300 rounded-lg p-5 space-y-6">
                {result.introduction && (activeTab === "allResume" || activeTab === "introductionOnly") && (
                    <div>
                        <h3 className="font-bold text-lg mb-2 flex justify-between items-center">
                            자기소개서
                            <button
                                className="p-1 rounded hover:bg-gray-200"
                                onClick={() => handleCopy("introduce")}
                            >
                                <Copy size={16} />
                            </button>
                        </h3>
                        <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-md">
                            {result.introduction}
                        </pre>
                    </div>
                )}

                {result.experience && (activeTab === "allResume" || activeTab === "experienceOnly") && (
                    <div>
                        <h3 className="font-bold text-lg mb-2 flex justify-between items-center">
                            경력기술서
                            <button
                                className="p-1 rounded hover:bg-gray-200"
                                onClick={() => handleCopy("experience")}
                            >
                                <Copy size={16} />
                            </button>
                        </h3>
                        <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-md">
                            {result.experience}
                        </pre>
                    </div>
                )}

                {result.certifications && (
                    <div>
                        <h3 className="font-bold text-lg mb-2 flex justify-between items-center">
                            자격증
                            <button
                                className="p-1 rounded hover:bg-gray-200"
                                onClick={() => handleCopy("certification")}
                            >
                                <Copy size={16} />
                            </button>
                        </h3>
                        <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-md">
                            {result.certifications}
                        </pre>
                    </div>
                )}

                <DocxExportButton />
            </div>
        )}
    </>
    );
}
