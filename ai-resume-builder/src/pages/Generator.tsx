/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Generator.tsx
import { useEffect, useRef, useState } from "react";
import { useResumeStore } from "../store/useResumeStore";
import axios from "axios";
import BasicInfo from "../components/BasicInfo";
import Education from "../components/Education";
import Experience from "../components/Experience"; // 프로젝트 경력
import Certification from "../components/Certification";
import Result from "../components/Result";
import Button from "../components/Button";
import CompanyExperience from "../components/CompanyExperience";


interface Result {
    introduction: string;
    experience: string;
    certifications?: string;
}


type Tab = "allResume" | "experienceOnly" | "introductionOnly" | "certificationOnly";

export default function Generator() {
    const {
        userInput,
        setUserInput,
        setCertification,
        setEducation,
        setExperiences,
        certifications,
        education,
        experiences,
        loadFromStorage,
        companyExperiences,
        setCompanyExperiences
    } = useResumeStore();

    const [activeTab, setActiveTab] = useState<Tab>("allResume");
    const [loading, setLoading] = useState(false);
    const [, setError] = useState<string | null>(null);
    const [result, setResult] = useState<Result | null>(null);
    const [step, setStep] = useState(1);

    const sectionRefs: any = {
        1: useRef<HTMLDivElement>(null),
        2: useRef<HTMLDivElement>(null),
        3: useRef<HTMLDivElement>(null),
        4: useRef<HTMLDivElement>(null),
        5: useRef<HTMLDivElement>(null),
    };



    const handleGenerateAllResume = async () => {
        if (loading || experiences.length === 0) {
            alert("경력 항목을 하나 이상 추가해주세요.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post("https://resume-6mrx.onrender.com/api/generate", {
                userInput: { ...userInput, experiences, certifications, education, companyExperiences },
                mode: "allResume",
            });
            setResult(response.data);
            setUserInput({ resultData: response.data });
        } catch (e: any) {
            setError(
                e.response?.status === 429
                    ? "요청이 너무 많아요. 잠시 후 다시 시도해주세요."
                    : e.message || "알 수 없는 오류가 발생했습니다."
            );
        } finally {
            setLoading(false);
        }
    };

    // 경력기술서 생성 핸들러
    const handleGenerateExperience = async () => {
        if (loading || experiences.length === 0) {
            alert("경력 항목을 하나 이상 추가해주세요.");
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post("https://resume-6mrx.onrender.com/api/generate", {
                userInput: { ...userInput, experiences },
                mode: "experienceOnly",
            });
            setResult(response.data);
            setUserInput({ resultData: response.data });
        } catch (e: any) {
            setError(e.message || "알 수 없는 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 자기소개서 생성 핸들러
    const handleGenerateIntroduction = async () => {
        if (loading) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post("https://resume-6mrx.onrender.com/api/generate/introduction", {
                userInput,
                mode: "introductionOnly",
            });
            setResult(response.data);
            setUserInput({ resultData: response.data });
        } catch (e: any) {
            setError(e.message || "알 수 없는 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 자격증 생성 핸들러
    const handleGenerateCertification = async () => {
        if (loading || certifications.length === 0) {
            alert("자격증 항목을 하나 이상 추가해주세요.");
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post("https://resume-6mrx.onrender.com/api/generate/experience", {
                userInput: { ...userInput, certifications },
                mode: "certificationOnly",
            });
            setResult(response.data);
            setUserInput({ resultData: response.data });
        } catch (e: any) {
            setError(e.message || "알 수 없는 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const resetAll = () => {
        localStorage.removeItem("resume-userInput");
        localStorage.removeItem("resume-experiences");
        localStorage.removeItem("resume-certifications");
        localStorage.removeItem("resume-education");
        location.reload();
    };

    const goToNextStep = (nextStep: number) => {
        setStep(nextStep);
        setTimeout(() => {
            sectionRefs[nextStep]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
    };

    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    return (
        <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg ring-1 ring-gray-200 space-y-8">
            <h1 className="text-4xl font-extrabold text-center text-gray-900 tracking-tight">
                AI 이력서 생성기
            </h1>

            <Button onClick={resetAll} variant="danger" className="text-sm mt-2 mb-4">
                전체 초기화
            </Button>

            <Button
                onClick={() => {
                    setUserInput({
                        name: "홍길동",
                        email: "hong@example.com",
                        phone: "010-1234-5678",
                        address: "서울특별시 강남구 테헤란로 123",
                        photo: new File([], "test.jpg"), // 빈 파일로 대체, 실제 이미지는 직접 넣으셔야 해요
                    });
                    setCompanyExperiences([
                        {
                            companyName: "네이버",
                            startDate: "2018-01",
                            endDate: "2020-12",
                            currentlyWorking: false,
                            position: "프론트엔드 개발자",
                            description: "React 기반 사내 플랫폼 개발 및 유지보수",
                        },
                    ]);
                    setEducation([
                        {
                            title: "서울대학교",
                            period: "2014-03 ~ 2018-02",
                            major: "컴퓨터공학과",
                        },
                    ]);
                    setExperiences([
                        {
                            title: "사내 검색 시스템 개선",
                            period: "2024~2025",
                            activities: "ElasticSearch 기반 검색 결과 정렬 알고리즘 개선 및 UI/UX 리뉴얼",
                            learnings: "검색 시스템의 구조 및 쿼리 최적화 기법을 학습",
                        },
                        {
                            title: "프로젝트 관리 도구 개발",
                            period: "2023~2024",
                            activities: "사내 전용 프로젝트 관리 웹앱 개발 (React, TypeScript, Zustand)",
                            learnings: "상태 관리와 컴포넌트 분리에 대한 깊은 이해",
                        },
                        {
                            title: "CI/CD 파이프라인 구축",
                            period: "2022~2023",
                            activities: "GitHub Actions, Docker, AWS를 활용한 자동 배포 파이프라인 구축",
                            learnings: "DevOps 실무와 배포 자동화 도구 활용 경험",
                        },
                        {
                            title: "AI 챗봇 서비스 운영",
                            period: "2021~2022",
                            activities: "고객 지원용 챗봇 백엔드 API 개발 및 대시보드 제작",
                            learnings: "REST API 설계 및 머신러닝 모델 연동 방법 습득",
                        },
                        {
                            title: "웹 접근성 개선 작업",
                            period: "2020~2021",
                            activities: "공공기관 웹사이트의 접근성 개선 및 점자 리더기 대응 작업 수행",
                            learnings: "WCAG 가이드라인에 따른 웹 접근성 기준 이해 및 적용",
                        },
                    ]);

                    setCertification([
                        {
                            title: "정보처리기사",
                            date: "2017-06",
                        },
                    ]);
                    setStep(5);
                    alert("예시 데이터가 입력되었습니다!");
                }}
                variant="basic"
                className="text-sm mt-2 mb-4"
            >
                예시 데이터 불러오기
            </Button>


            {/* 탭 버튼 */}
            <div className="flex space-x-4 mb-6">
                {(["allResume", "experienceOnly", "introductionOnly", "certificationOnly"] as Tab[]).map((tab) => (
                    <Button
                        key={tab}
                        variant={activeTab === tab ? "tab-active" : "tab-inactive"}
                        onClick={() => setActiveTab(tab)}
                    >
                        {{
                            allResume: "이력서 (전부)",
                            experienceOnly: "경력기술서",
                            introductionOnly: "자기소개서",
                            certificationOnly: "자격증",
                        }[tab]}
                    </Button>
                ))}
            </div>

            {activeTab === "allResume" && (
                <>
                    {/* STEP 1 - 기본 정보 */}
                    <div ref={sectionRefs[1]}>
                        <BasicInfo />
                        <Button onClick={() => goToNextStep(2)} className="mt-4">
                            다음
                        </Button>
                    </div>

                    {/* STEP 2 - 회사 경험 추가 */}
                    {step >= 2 && (
                        <div ref={sectionRefs[2]}>
                            <CompanyExperience companyExperiences={companyExperiences} setCompanyExperiences={setCompanyExperiences} />

                            {/* 회사 경험 데이터가 1개 이상일 때만 다음 버튼 노출 */}
                            {companyExperiences.length > 0 && (
                                <Button className="mt-4" onClick={() => goToNextStep(3)}>
                                    다음
                                </Button>
                            )}
                        </div>
                    )}

                    {/* STEP 3 - 학력 */}
                    {step >= 3 && (
                        <div ref={sectionRefs[3]}>
                            <Education
                                educations={education}
                                setEducations={(data) => {
                                    setEducation(data);
                                }}
                            />
                            {/* 학력 데이터가 1개 이상일 때만 다음 버튼 노출 */}
                            {education.length > 0 && (
                                <Button className="mt-4" onClick={() => goToNextStep(4)}>
                                    다음
                                </Button>
                            )}
                        </div>
                    )}

                    {/* STEP 4 - 프로젝트 경력 */}
                    {step >= 4 && (
                        <div ref={sectionRefs[4]}>
                            <Experience
                                experiences={experiences}
                                setExperiences={(data) => {
                                    setExperiences(data);
                                }}
                            />
                            {/* 경력 데이터가 1개 이상일 때만 다음 버튼 노출 */}
                            {experiences.length > 0 && (
                                <Button className="mt-4" onClick={() => goToNextStep(5)}>
                                    다음
                                </Button>
                            )}
                        </div>
                    )}

                    {/* STEP 5 - 자격증 */}
                    {step >= 5 && (
                        <div ref={sectionRefs[5]}>
                            <Certification certifications={certifications} setCertifications={setCertification} />
                            <Button fullWidth className="mt-8 py-3" onClick={handleGenerateAllResume} disabled={loading}>
                                {loading ? "생성 중..." : "이력서 (전부) 생성"}
                            </Button>
                        </div>
                    )}
                </>
            )}

            {activeTab === "experienceOnly" && (
                <>
                    <Experience experiences={experiences} setExperiences={setExperiences} />
                    <Button fullWidth className="mt-8 py-3" onClick={handleGenerateExperience} disabled={loading}>
                        {loading ? "생성 중..." : "경력기술서 생성"}
                    </Button>
                </>
            )}

            {activeTab === "introductionOnly" && (
                <>
                    <BasicInfo />
                    <Button fullWidth className="mt-8 py-3" onClick={handleGenerateIntroduction} disabled={loading}>
                        {loading ? "생성 중..." : "자기소개서 생성"}
                    </Button>
                </>
            )}

            {activeTab === "certificationOnly" && (
                <>
                    <Certification certifications={certifications} setCertifications={setCertification} />
                    <Button fullWidth className="mt-8 py-3" onClick={handleGenerateCertification} disabled={loading}>
                        {loading ? "생성 중..." : "자격증 생성"}
                    </Button>
                </>
            )}

            {result && <Result activeTab={activeTab} result={result} />}
        </div>
    );

}
