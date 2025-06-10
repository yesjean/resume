/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useResumeStore } from "../store/useResumeStore";
import axios from "axios";
import { Copy } from "lucide-react";
import DocxExportButton from "../components/DocxExportButton";

interface EducationItem {
    title: string;
    period: string;
    major: string;
}
interface ExperienceItem {
    title: string;
    period: string;
    activities: string;
    learnings: string;
}

interface CertificationItem {
    title: string;
    date: string;
}

interface Result {
    introduction: string;
    experience: string;
    certifications?: string; // 필요시
}

type Tab = "allResume" | "experienceOnly" | "introductionOnly" | "certificationOnly";

export default function Generator() {
    const { userInput, setUserInput, setCertification, setEducation } = useResumeStore();

    const [activeTab, setActiveTab] = useState<Tab>("allResume");

    const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
    const [certifications, setCertifications] = useState<CertificationItem[]>([]);
    const [educations, setEducations] = useState<EducationItem[]>([]);

    const [currentEdu, setCurrentEdu] = useState<EducationItem>({
        title: "",
        period: "",
        major: "",
    });

    const [currentExp, setCurrentExp] = useState<ExperienceItem>({
        title: "",
        period: "",
        activities: "",
        learnings: "",
    });

    const [currentCert, setCurrentCert] = useState<CertificationItem>({
        title: "",
        date: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<Result | null>(null);
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

    // 경력 입력 변경
    const handleEduChange = (field: keyof EducationItem, value: string) => {
        setCurrentEdu((prev) => ({ ...prev, [field]: value }));
    };

    // 경력 입력 변경
    const handleExpChange = (field: keyof ExperienceItem, value: string) => {
        setCurrentExp((prev) => ({ ...prev, [field]: value }));
    };

    // 자격증 입력 변경
    const handleCertChange = (field: keyof CertificationItem, value: string) => {
        setCurrentCert((prev) => ({ ...prev, [field]: value }));
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
        setExperiences((prev) => [...prev, currentExp]);
        setCurrentExp({ title: "", period: "", activities: "", learnings: "" });
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
        setEducations((prev) => [...prev, currentEdu]);
        setCurrentEdu({ title: "", period: "", major: "" });
    };

    const addCertification = () => {
        if (!currentCert.title.trim() || !currentCert.date.trim()) {
            alert("모든 자격증 항목을 입력해주세요.");
            return;
        }
        setCertifications((prev) => [...prev, currentCert]);
        setCurrentCert({ title: "", date: "" });
    };

    // 전체 이력서 생성 (기본정보 + 경력 + 자격증)
    const handleGenerateAllResume = async () => {
        if (loading) return;
        if (experiences.length === 0) {
            alert("경력 항목을 하나 이상 추가해주세요.");
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post("http://localhost:4000/api/generate", {
                userInput: {
                    ...userInput,
                    experiences,
                    certifications,
                },
                mode: "allResume",
            });

            setResult(response.data);
            setUserInput({ resultData: response.data });
            setCertification(certifications)
            setEducation(educations)
            console.log("전체 이력서 생성:", response.data);
        } catch (e: any) {
            if (e.response?.status === 429) {
                setError("요청이 너무 많아요. 잠시 후 다시 시도해주세요.");
            } else {
                setError(e.message || "알 수 없는 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    // 경력기술서 생성
    const handleGenerateExperience = async () => {
        if (loading) return;
        if (experiences.length === 0) {
            alert("경력 항목을 하나 이상 추가해주세요.");
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post("http://localhost:4000/api/generate", {
                userInput: {
                    ...userInput,
                    experiences,
                },
                mode: "experienceOnly",
            });

            setResult(response.data);
            setUserInput({ resultData: response.data });
            console.log("경력기술서 생성:", response.data);
        } catch (e: any) {
            if (e.response?.status === 429) {
                setError("요청이 너무 많아요. 잠시 후 다시 시도해주세요.");
            } else {
                setError(e.message || "알 수 없는 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    // 자기소개서 생성
    const handleGenerateIntroduction = async () => {
        if (loading) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post("http://localhost:4000/api/generate/introduction", {
                userInput: {
                    ...userInput,
                },
                mode: "introductionOnly",
            });

            setResult(response.data);
            setUserInput({ resultData: response.data });
            console.log("자기소개서 생성:", response.data);
        } catch (e: any) {
            if (e.response?.status === 429) {
                setError("요청이 너무 많아요. 잠시 후 다시 시도해주세요.");
            } else {
                setError(e.message || "알 수 없는 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    // 자격증 생성
    const handleGenerateCertification = async () => {
        if (loading) return;
        if (certifications.length === 0) {
            alert("자격증 항목을 하나 이상 추가해주세요.");
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post("http://localhost:4000/api/generate/experience", {
                userInput: {
                    ...userInput,
                    certifications,
                },
                mode: "certificationOnly",
            });

            setResult(response.data);
            setUserInput({ resultData: response.data });
            console.log("자격증 생성:", response.data);
        } catch (e: any) {
            if (e.response?.status === 429) {
                setError("요청이 너무 많아요. 잠시 후 다시 시도해주세요.");
            } else {
                setError(e.message || "알 수 없는 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    const resetAll = () => {
        localStorage.removeItem("resume-userInput");
        localStorage.removeItem("resume-experiences");
        localStorage.removeItem("resume-certifications");
        location.reload();
    };

    const handleDeleteEducation = (index: number) => {
        setEducations((prev) => prev.filter((_, i) => i !== index));
    };


    const handleDeleteExperience = (index: number) => {
        setExperiences((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDeleteCertification = (index: number) => {
        setCertifications((prev) => prev.filter((_, i) => i !== index));
    };


    useEffect(() => {
        useResumeStore.getState().loadFromStorage();
    }, []);

    return (
        <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg ring-1 ring-gray-200 space-y-8">
            <h1 className="text-4xl font-extrabold text-center text-gray-900 tracking-tight">
                AI 이력서 생성기
            </h1>
            <button
                onClick={resetAll}
                className="text-sm text-red-500 underline mt-2 mb-4"
            >
                전체 초기화
            </button>

            {/* 탭 UI */}
            <div className="flex space-x-4 mb-6">
                <button
                    className={`py-2 px-4 rounded ${activeTab === "allResume"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                        }`}
                    onClick={() => setActiveTab("allResume")}
                >
                    이력서 (전부)
                </button>
                <button
                    className={`py-2 px-4 rounded ${activeTab === "experienceOnly"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                        }`}
                    onClick={() => setActiveTab("experienceOnly")}
                >
                    경력기술서
                </button>
                <button
                    className={`py-2 px-4 rounded ${activeTab === "introductionOnly"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                        }`}
                    onClick={() => setActiveTab("introductionOnly")}
                >
                    자기소개서
                </button>
                <button
                    className={`py-2 px-4 rounded ${activeTab === "certificationOnly"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                        }`}
                    onClick={() => setActiveTab("certificationOnly")}
                >
                    자격증
                </button>
            </div>

            {/* 탭별 내용 */}
            {activeTab === "allResume" && (
                <>
                    {/* 기본 정보 */}


                    {/* 증명사진 업로드 */}
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full mb-5 text-gray-700 focus:outline-none"
                        onChange={(e) => setUserInput({ ...userInput, photo: e.target.files![0] })}
                    />
                    <input
                        className="w-full mb-5 border border-gray-300 rounded-lg px-5 py-3 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                        placeholder="이름"
                        value={userInput.name}
                        onChange={(e) => setUserInput({ name: e.target.value })}
                    />

                    {/* 성별 */}
                    <select
                        className="w-full mb-5 border border-gray-300 rounded-lg px-5 py-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                        value={userInput.gender}
                        onChange={(e) => setUserInput({ ...userInput, gender: e.target.value })}
                    >
                        <option value="">성별 선택</option>
                        <option value="male">남성</option>
                        <option value="female">여성</option>
                        <option value="other">기타</option>
                    </select>

                    {/* 생년월일 */}
                    <input
                        type="date"
                        className="w-full mb-5 border border-gray-300 rounded-lg px-5 py-3 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                        value={userInput.birthDate}
                        onChange={(e) => setUserInput({ ...userInput, birthDate: e.target.value })}
                    />

                    {/* 전화번호 */}
                    <input
                        type="tel"
                        className="w-full mb-5 border border-gray-300 rounded-lg px-5 py-3 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                        placeholder="전화번호"
                        value={userInput.phone}
                        onChange={(e) => setUserInput({ ...userInput, phone: e.target.value })}
                    />

                    {/* 이메일 */}
                    <input
                        type="email"
                        className="w-full mb-5 border border-gray-300 rounded-lg px-5 py-3 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                        placeholder="이메일"
                        value={userInput.email}
                        onChange={(e) => setUserInput({ ...userInput, email: e.target.value })}
                    />

                    {/* 깃헙 주소 */}
                    <input
                        type="url"
                        className="w-full mb-5 border border-gray-300 rounded-lg px-5 py-3 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                        placeholder="깃헙 주소"
                        value={userInput.github}
                        onChange={(e) => setUserInput({ ...userInput, github: e.target.value })}
                    />

                    {/* 주소 */}
                    <input
                        type="text"
                        className="w-full mb-5 border border-gray-300 rounded-lg px-5 py-3 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                        placeholder="주소"
                        value={userInput.address}
                        onChange={(e) => setUserInput({ ...userInput, address: e.target.value })}
                    />
                    <input
                        className="w-full mb-5 border border-gray-300 rounded-lg px-5 py-3 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                        placeholder="포지션"
                        value={userInput.position}
                        onChange={(e) => setUserInput({ position: e.target.value })}
                    />

                    <textarea
                        className="w-full mb-5 border border-gray-300 rounded-lg px-5 py-3 h-24 resize-none text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                        placeholder="경력 요약"
                        value={userInput.experience}
                        onChange={(e) => setUserInput({ experience: e.target.value })}
                    />
                    <textarea
                        className="w-full mb-8 border border-gray-300 rounded-lg px-5 py-3 h-24 resize-none text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                        placeholder="지원 공고 내용"
                        value={userInput.jobPost}
                        onChange={(e) => setUserInput({ jobPost: e.target.value })}
                    />
                    <textarea
                        className="w-full mb-8 border border-gray-300 rounded-lg px-5 py-3 h-24 resize-none text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                        placeholder="간단한 자기소개를 입력하세요"
                        value={userInput.briefIntro}
                        onChange={(e) => setUserInput({ briefIntro: e.target.value })}
                    />
                    <select
                        className="w-full mb-8 border border-gray-300 rounded-lg px-5 py-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                        value={userInput.tone}
                        onChange={(e) => setUserInput({ tone: e.target.value })}
                    >
                        <option value="logical">논리적</option>
                        <option value="emotional">감성적</option>
                        <option value="bold">도전적인</option>
                    </select>

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

                    {/* 경력 입력폼 */}
                    <div className="border border-gray-300 rounded-lg p-5 space-y-4">
                        <h2 className="text-xl font-semibold mb-4">경력 추가</h2>
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
                            className="w-full border border-gray-300 rounded-md px-4 py-2 h-20 resize-none text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            placeholder="주요 업무 및 활동"
                            value={currentExp.activities}
                            onChange={(e) => handleExpChange("activities", e.target.value)}
                        />
                        <textarea
                            className="w-full border border-gray-300 rounded-md px-4 py-2 h-20 resize-none text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            placeholder="배운 점"
                            value={currentExp.learnings}
                            onChange={(e) => handleExpChange("learnings", e.target.value)}
                        />
                        <button
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            onClick={addExperience}
                        >
                            경력 추가
                        </button>
                    </div>
                    {/* 경력 리스트 */}
                    {experiences.length > 0 && (
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold mb-2">추가된 경력</h2>
                            <ul className="list-disc list-inside space-y-2">
                                {experiences.map((exp, idx) => (
                                    <li key={idx} className="flex justify-between items-center">
                                        <div>
                                            {exp.title} ({exp.period})
                                        </div>
                                        <button
                                            onClick={() => handleDeleteExperience(idx)}
                                            className="text-red-500 hover:underline text-sm ml-4"
                                        >
                                            삭제
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}


                    {/* 자격증 입력폼 */}
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
                    <button
                        className="w-full mt-8 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                        onClick={handleGenerateAllResume}
                        disabled={loading}
                    >
                        {loading ? "생성 중..." : "이력서 (전부) 생성"}
                    </button>
                </>
            )}

            {activeTab === "experienceOnly" && (
                <>
                    {/* 경력 입력폼 (복사) */}
                    <div className="border border-gray-300 rounded-lg p-5 space-y-4">
                        <h2 className="text-xl font-semibold mb-4">경력 추가</h2>
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
                            className="w-full border border-gray-300 rounded-md px-4 py-2 h-20 resize-none text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            placeholder="주요 업무 및 활동"
                            value={currentExp.activities}
                            onChange={(e) => handleExpChange("activities", e.target.value)}
                        />
                        <textarea
                            className="w-full border border-gray-300 rounded-md px-4 py-2 h-20 resize-none text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            placeholder="배운 점"
                            value={currentExp.learnings}
                            onChange={(e) => handleExpChange("learnings", e.target.value)}
                        />
                        <button
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            onClick={addExperience}
                        >
                            경력 추가
                        </button>
                    </div>
                    {/* 경력 리스트 */}
                    {experiences.length > 0 && (
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold mb-2">추가된 경력</h2>
                            <ul className="list-disc list-inside space-y-1">
                                {experiences.map((exp, idx) => (
                                    <li key={idx}>
                                        {exp.title} ({exp.period})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                        className="w-full mt-8 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                        onClick={handleGenerateExperience}
                        disabled={loading}
                    >
                        {loading ? "생성 중..." : "경력기술서 생성"}
                    </button>
                </>
            )}

            {activeTab === "introductionOnly" && (
                <>
                    {/* 기본정보 + 자기소개서 폼 */}
                    <input
                        className="w-full mb-5 border border-gray-300 rounded-lg px-5 py-3 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                        placeholder="이름"
                        value={userInput.name}
                        onChange={(e) => setUserInput({ name: e.target.value })}
                    />
                    <input
                        className="w-full mb-5 border border-gray-300 rounded-lg px-5 py-3 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                        placeholder="포지션"
                        value={userInput.position}
                        onChange={(e) => setUserInput({ position: e.target.value })}
                    />
                    <textarea
                        className="w-full mb-8 border border-gray-300 rounded-lg px-5 py-3 h-24 resize-none text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                        placeholder="간단한 자기소개를 입력하세요"
                        value={userInput.briefIntro}
                        onChange={(e) => setUserInput({ briefIntro: e.target.value })}
                    />
                    <select
                        className="w-full mb-8 border border-gray-300 rounded-lg px-5 py-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                        value={userInput.tone}
                        onChange={(e) => setUserInput({ tone: e.target.value })}
                    >
                        <option value="logical">논리적</option>
                        <option value="emotional">감성적</option>
                        <option value="bold">도전적인</option>
                    </select>

                    <button
                        className="w-full mt-8 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                        onClick={handleGenerateIntroduction}
                        disabled={loading}
                    >
                        {loading ? "생성 중..." : "자기소개서 생성"}
                    </button>
                </>
            )}

            {activeTab === "certificationOnly" && (
                <>
                    {/* 자격증 입력폼 (복사) */}
                    <div className="border border-gray-300 rounded-lg p-5 space-y-4">
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

                    <button
                        className="w-full mt-8 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                        onClick={handleGenerateCertification}
                        disabled={loading}
                    >
                        {loading ? "생성 중..." : "자격증 생성"}
                    </button>
                </>
            )}

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
        </div>
    );
}
