// 기존 import 및 설정 유지
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  handler: (req, res) => {
    res.status(429).json({ error: "너무 많은 요청입니다. 잠시 후 다시 시도해주세요." });
  },
});
app.use(limiter);

// ✅ 기존 통합 엔드포인트는 그대로 유지됨
app.post("/api/generate", async (req, res) => {
  try {
    const { userInput } = req.body;

    // 필수 문자열 필드 검사
    if (
      !userInput ||
      typeof userInput.name !== "string" ||
      typeof userInput.position !== "string" ||
      typeof userInput.experience !== "string" ||
      typeof userInput.jobPost !== "string" ||
      typeof userInput.tone !== "string" ||
      !Array.isArray(userInput.experiences)
    ) {
      return res.status(400).json({
        error:
          "userInput에 name, position, experience, jobPost, tone(문자열)과 experiences(배열)가 포함되어야 합니다.",
      });
    }

    // 경력 항목 유효성 간단 검사 (경험 없으면 빈 배열로 보내도 됨)
    const experiences = userInput.experiences.map((exp) => ({
      title: exp.title || "",
      period: exp.period || "",
      activities: exp.activities || "",
      learnings: exp.learnings || "",
    }));

    // 자기소개서용 프롬프트
    const introPrompt = `
아래의 간단한 자기소개 내용을 바탕으로 개발자 자기소개를 전문적으로 작성해주세요.

결과에는 절대 "논리적이고 체계적인 문체로 자기소개서를 작성하였으며," 같은
작업 지시 문구나 문체 설명은 포함하지 마세요.

간단한 자기소개: ${userInput.briefIntro}

이름: ${userInput.name}
지원 포지션: ${userInput.position}
경력 요약: ${userInput.experience}
지원하는 회사 및 공고 내용: ${userInput.jobPost}
문체: ${userInput.tone}

800자 이내로 간결하면서도 전문성 있게 작성해 주세요. AI가 쓰지 않은것 같은 사람이 쓴것 같은 말투로 작성 해주세요.
`;


    // 경력기술서용 프롬프트
    const experiencePrompt = `
아래는 지원자가 직접 작성한 개발 프로젝트 및 업무 경력입니다. 

각 경력별로 제목, 기간, 활동 내용, 그리고 배운 점이 있습니다. 

이 내용을 기반으로 개발자 경력기술서를 작성해주세요. 

- 기술 스택, 문제 해결, 성과 위주로 구체적이고 전문적으로 다듬어 주세요.
- 문체는 ${userInput.tone} 톤으로 자연스럽고 긍정적으로 작성해주세요.

경력 목록:

${experiences
        .map(
          (exp, i) => `
프로젝트 ${i + 1}:
- 제목: ${exp.title}
- 기간: ${exp.period}
- 활동 내용: ${exp.activities}
- 배운 점: ${exp.learnings}
`
        )
        .join("\n")}
`;


    // 두 프롬프트를 병렬로 요청
    const [introResponse, experienceResponse] = await Promise.all([
      openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: introPrompt }],
        temperature: 0.7,
        max_tokens: 800,
      }),
      openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: experiencePrompt }],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    ]);

    const introduction = introResponse.choices[0].message?.content?.trim() || "";
    const experienceText = experienceResponse.choices[0].message?.content?.trim() || "";

    res.json({
      introduction,
      experience: experienceText,
    });
  } catch (error) {
    console.error("OpenAI API 호출 에러:", error);

    if (error.status === 429) {
      return res.status(429).json({ error: "API 요청 한도 초과입니다. 잠시 후 시도해주세요." });
    }

    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

// ✅ 자기소개서 전용 API 추가
app.post("/api/generate/introduction", async (req, res) => {
  try {
    const { name, position, experience, jobPost, tone, briefIntro } = req.body;

    if (![name, position, experience, jobPost, tone, briefIntro].every((v) => typeof v === "string")) {
      return res.status(400).json({ error: "모든 필드는 문자열이어야 합니다." });
    }

    const introPrompt = `
당신은 개발자 입니다. 아래의 간단한 자기소개 내용을 바탕으로 개발자 자기소개를 전문적으로 작성해주세요.

결과에는 절대 "논리적이고 체계적인 문체로 자기소개서를 작성하였으며," 같은
작업 지시 문구나 문체 설명은 포함하지 마세요.

간단한 자기소개: ${briefIntro}
이름: ${name}
지원 포지션: ${position}
경력 요약: ${experience}
지원하는 회사 및 공고 내용: ${jobPost}
문체: ${tone}

800자 이내로 간결하면서도 전문성 있게 작성해 주세요.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: introPrompt }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const introduction = response.choices[0].message?.content?.trim() || "";
    res.json({ introduction });
  } catch (error) {
    console.error("자기소개서 에러:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

// ✅ 경력기술서 전용 API 추가
app.post("/api/generate/experience", async (req, res) => {
  try {
    const { tone, experiences } = req.body;

    if (typeof tone !== "string" || !Array.isArray(experiences)) {
      return res.status(400).json({
        error: "tone은 문자열, experiences는 배열이어야 합니다.",
      });
    }

    const formattedExperiences = experiences.map((exp) => ({
      title: exp.title || "",
      period: exp.period || "",
      activities: exp.activities || "",
      learnings: exp.learnings || "",
    }));

    const experiencePrompt = `
아래는 지원자가 직접 작성한 개발 프로젝트 및 업무 경력입니다.

각 경력별로 제목, 기간, 활동 내용, 그리고 배운 점이 있습니다.

이 내용을 기반으로 개발자 경력기술서를 작성해주세요.

- 기술 스택, 문제 해결, 성과 위주로 구체적이고 전문적으로 다듬어 주세요.
- 문체는 ${tone} 톤으로 자연스럽고 긍정적으로 작성해주세요.

경력 목록:

${formattedExperiences
        .map(
          (exp, i) => `
프로젝트 ${i + 1}:
- 제목: ${exp.title}
- 기간: ${exp.period}
- 활동 내용: ${exp.activities}
- 배운 점: ${exp.learnings}
`
        )
        .join("\n")}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: experiencePrompt }],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const experience = response.choices[0].message?.content?.trim() || "";
    res.json({ experience });
  } catch (error) {
    console.error("경력기술서 에러:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
