import { create } from 'zustand'

interface ExperienceItem {
  title: string
  period: string
  activities: string
  learnings: string
}

interface CertificationItem {
  title: string
  date: string
}

interface EducationItem {
  title: string
  period: string
  major: string
}

export interface ResultData {
  introduction: string
  experience: string
}

interface CompanyExperienceItem {
  companyName: string
  startDate: string
  endDate: string
  currentlyWorking: boolean
  position: string
  description: string
}

interface ResumeState {
  userInput: {
    name: string
    phone: string
    email: string
    github: string
    photo: File
    address: string
    gender: string
    birthDate: string
    position: string
    experience: string
    jobPost: string
    tone: string
    briefIntro: string
    resultData: ResultData
  }
  education: EducationItem[]
  experiences: ExperienceItem[]
  certifications: CertificationItem[]
  companyExperiences: CompanyExperienceItem[]
  result: string

  setUserInput: (input: Partial<ResumeState['userInput']>) => void
  setExperiences: (exps: ExperienceItem[]) => void
  setCertification: (certs: CertificationItem[]) => void
  setEducation: (edus: EducationItem[]) => void
  setCompanyExperiences: (cexps: CompanyExperienceItem[]) => void
  addCompanyExperience: (cexp: CompanyExperienceItem) => void
  setResult: (res: string) => void
  setResultData: (data: ResultData) => void
  loadFromStorage: () => void
  resetAll: () => void
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  userInput: {
    name: '',
    phone: '',
    email: '',
    github: '',
    photo: new File([], ''),
    address: '',
    gender: '',
    birthDate: '',
    position: '',
    experience: '',
    jobPost: '',
    tone: '',
    briefIntro: '',
    resultData: {
      introduction: '',
      experience: '',
    },
  },
  education: [],
  experiences: [],
  certifications: [],
  companyExperiences: [],
  result: '',

  setCompanyExperiences: (cexps) => {
    localStorage.setItem('resume-companyExperiences', JSON.stringify(cexps))
    set({ companyExperiences: cexps })
  },

  addCompanyExperience: (cexp) => {
    const current = get().companyExperiences
    const updated = [...current, cexp]
    localStorage.setItem('resume-companyExperiences', JSON.stringify(updated))
    set({ companyExperiences: updated })
  },

  setUserInput: (input) =>
    set((state) => {
      const updated = { ...state.userInput, ...input }
      localStorage.setItem('resume-userInput', JSON.stringify(updated))
      return { userInput: updated }
    }),

  setExperiences: (exps) => {
    localStorage.setItem('resume-experiences', JSON.stringify(exps))
    set({ experiences: exps })
  },

  setCertification: (certs) => {
    localStorage.setItem('resume-certifications', JSON.stringify(certs))
    set({ certifications: certs })
  },

  setEducation: (edus) => {
    localStorage.setItem('resume-education', JSON.stringify(edus))
    set({ education: edus })
  },

  setResult: (res) => set({ result: res }),

  setResultData: (data) =>
    set((state) => {
      const updated = {
        ...state.userInput,
        resultData: data,
      }
      localStorage.setItem('resume-userInput', JSON.stringify(updated))
      return { userInput: updated }
    }),

  loadFromStorage: () => {
    const savedInput = localStorage.getItem('resume-userInput')
    const savedExps = localStorage.getItem('resume-experiences')
    const savedCerts = localStorage.getItem('resume-certifications')
    const savedEdus = localStorage.getItem('resume-education')
    const savedCompanyExps = localStorage.getItem('resume-companyExperiences')

    if (savedInput) set({ userInput: JSON.parse(savedInput) })
    if (savedExps) set({ experiences: JSON.parse(savedExps) })
    if (savedCerts) set({ certifications: JSON.parse(savedCerts) })
    if (savedEdus) set({ education: JSON.parse(savedEdus) })
    if (savedCompanyExps) set({ companyExperiences: JSON.parse(savedCompanyExps) })
  },

  resetAll: () => {
    localStorage.removeItem('resume-userInput')
    localStorage.removeItem('resume-experiences')
    localStorage.removeItem('resume-certifications')
    localStorage.removeItem('resume-education')
    localStorage.removeItem('resume-companyExperiences')

    set({
      userInput: {
        name: '',
        phone: '',
        email: '',
        github: '',
        photo: new File([], ''),
        address: '',
        gender: '',
        birthDate: '',
        position: '',
        experience: '',
        jobPost: '',
        tone: '',
        briefIntro: '',
        resultData: {
          introduction: '',
          experience: '',
        },
      },
      education: [],
      experiences: [],
      certifications: [],
      companyExperiences: [],
      result: '',
    })
  },
}))
