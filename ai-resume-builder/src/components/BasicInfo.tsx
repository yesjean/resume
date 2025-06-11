/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useResumeStore } from "../store/useResumeStore";

export default function BasicInfo() {
    const { userInput, setUserInput } = useResumeStore();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        useResumeStore.getState().loadFromStorage();
    }, []);

useEffect(() => {
  if (userInput.photo && userInput.photo instanceof Blob) {
    const objectUrl = URL.createObjectURL(userInput.photo);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  } else {
    setPreviewUrl(null);
  }
}, [userInput.photo]);



    return (
        <>
            {/* <input
                type="file"
                accept="image/*"
                className="w-full mb-5 text-gray-700 focus:outline-none"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setUserInput({ ...userInput, photo: file });
                }}
            />
            {previewUrl && (
                <img
                    src={previewUrl}
                    alt="프로필 사진 미리보기"
                    className="w-32 h-32 object-cover rounded-full mb-5"
                />
            )} */}
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
                <option value="남성">남성</option>
                <option value="여성">여성</option>
                <option value="기타">기타</option>
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
        </>
    );
}
