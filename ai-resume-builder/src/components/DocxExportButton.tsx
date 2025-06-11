// components/ResumeExporter.tsx
import { saveAs } from 'file-saver'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { useResumeStore } from '../store/useResumeStore'

export default function ResumeExporter() {
  const { userInput, certifications, education, companyExperiences } = useResumeStore()

  const handleDownload = async () => {
    try {
      const res = await fetch('/resume-template3.docx')
      const templateBuffer = await res.arrayBuffer()

      const zip = new PizZip(templateBuffer)
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      })

      // certifications 배열 데이터 가공 (없으면 빈 배열)
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
            description: exp.description || ''
          }))
        : []

      doc.setData({
        name: userInput.name || '',
        position: userInput.position || '',
        introduction: userInput.resultData?.introduction || '',
        experience: userInput.resultData?.experience || '',
        certifications: formattedCertifications,

        // 추가 userInput 필드들
        jobPost: userInput.jobPost || '',
        tone: userInput.tone || '',
        briefIntro: userInput.briefIntro || '',
        phone: userInput.phone || '',
        email: userInput.email || '',
        github: userInput.github || '',
        // photo는 파일 객체라 docx 템플릿에 직접 넣기 어렵고, 보통 별도 처리 필요
        address: userInput.address || '',
        gender: userInput.gender || '',
        birthDate: userInput.birthDate || '',
        education: formattedEducations || '',
        companyExperiences: formattedCompanyExperience || '',
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
