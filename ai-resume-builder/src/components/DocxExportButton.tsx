import { saveAs } from 'file-saver'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { useResumeStore } from '../store/useResumeStore'
import ImageModule from 'docxtemplater-image-module-free'

export default function ResumeExporter() {
  const { userInput, certifications, education, companyExperiences } = useResumeStore()


  const handleDownload = async () => {
    try {
      const res = await fetch('/resume-template3.docx')
      const templateBuffer = await res.arrayBuffer()

      const zip = new PizZip(templateBuffer)

      // 이미지 모듈 설정
      const imageModule = new ImageModule({
        centered: false,
        getImage: function (tagValue) {
          if (!tagValue) return new Uint8Array()  // null 대신 빈 배열 반환

          if (typeof tagValue === "string") {
            const base64Data = tagValue.replace(/^data:image\/\w+;base64,/, "")
            const binaryString = atob(base64Data)
            const length = binaryString.length
            const bytes = new Uint8Array(length)
            for (let i = 0; i < length; i++) {
              bytes[i] = binaryString.charCodeAt(i)
            }
            return bytes
          }

          console.warn("Unsupported image type")
          return new Uint8Array()  // 다른 타입도 빈 배열 반환
        }
        ,
        getSize: function (img, tagValue, tagName) {
          // 이미지 크기 지정 (단위: px)
          // 예: 너비 150px, 높이 150px 고정
          return [150, 150]
        }
      })

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        modules: [imageModule],  // 이미지 모듈 등록
      })

      const now = new Date()
      const year = now.getFullYear().toString().slice(-2)
      const month = String(now.getMonth() + 1).padStart(2, "0")
      const day = String(now.getDate()).padStart(2, "0")

      const formattedCertifications = Array.isArray(certifications)
        ? certifications.map((exp) => ({
          title: exp.title || '',
          date: exp.date || '',
        }))
        : []

      const formattedEducations = Array.isArray(education)
        ? education.map((exp) => ({
          title: exp.title || '',
          period: exp.period || '',
          major: exp.major || '',
        }))
        : []

      const formattedCompanyExperience = Array.isArray(companyExperiences)
        ? companyExperiences.map((exp) => ({
          companyName: exp.companyName || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          currentlyWorking: exp.currentlyWorking ? '재직중' : '',
          position: exp.position || '',
          description: exp.description || '',
        }))
        : []

      doc.setData({
        name: userInput.name || '',
        position: userInput.position || '',
        introduction: userInput.resultData?.introduction || '',
        experience: userInput.resultData?.experience || '',
        certifications: formattedCertifications,

        // 이미지 태그에 photo 필드 전달
        photo: userInput.photo || '',

        // 추가 userInput 필드들
        jobPost: userInput.jobPost || '',
        tone: userInput.tone || '',
        briefIntro: userInput.briefIntro || '',
        phone: userInput.phone || '',
        email: userInput.email || '',
        github: userInput.github || '',
        address: userInput.address || '',
        gender: userInput.gender || '',
        birthDate: userInput.birthDate || '',
        education: formattedEducations || '',
        companyExperiences: formattedCompanyExperience || '',
        YEAR: year,
        MONTH: month,
        DAY: day,
      })

      doc.render()

      const blob = doc.getZip().generate({
        type: 'blob',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })

      saveAs(blob, '이력서.docx')
    } catch (err) {
      console.error('문서 생성 중 오류:', err)
      alert('문서 생성에 실패했습니다.')
    }
  }

  return (
    <button
      onClick={handleDownload}
      className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      이력서 .docx 다운로드
    </button>
  )
}
