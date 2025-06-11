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

interface ExperienceItem {
  title: string;
  period: string;
  activities: string;
  learnings: string;
}

interface Result {
  introduction: string;
  experience: string;
  certifications?: string;
}

interface CompanyExperienceData {
  companyName: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
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
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [step, setStep] = useState(1);

  const sectionRefs: any = {
    1: useRef<HTMLDivElement>(null),
    2: useRef<HTMLDivElement>(null),
    3: useRef<HTMLDivElement>(null),
    4: useRef<HTMLDivElement>(null),
    5: useRef<HTMLDivElement>(null),
  };

  // 회사 경험 여러개 관리
//   const [companyExperiences, setCompanyExperiences] = useState<CompanyExperienceData[]>([]);

  // 새 회사 경험 입력용 state
  const [newCompanyExperience, setNewCompanyExperience] = useState<CompanyExperienceData>({
    companyName: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
  });

  const addCompanyExperience = () => {
    if (!newCompanyExperience.companyName.trim()) {
      alert("회사명을 입력해주세요.");
      return;
    }
    setCompanyExperiences(companyExperiences);
    setNewCompanyExperience({
      companyName: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
    });
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
      const response = await axios.post("http://localhost:4000/api/generate", {
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
      const response = await axios.post("http://localhost:4000/api/generate", {
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
      const response = await axios.post("http://localhost:4000/api/generate/introduction", {
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
      const response = await axios.post("http://localhost:4000/api/generate/experience", {
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
