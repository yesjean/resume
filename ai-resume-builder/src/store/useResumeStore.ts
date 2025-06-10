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
  result: string
  setUserInput: (input: Partial<ResumeState['userInput']>) => void
  setExperiences: (exps: ExperienceItem[]) => void
  setResult: (res: string) => void
  setCertification: (certs: CertificationItem[]) => void
  setEducation: (certs: EducationItem[]) => void
  setResultData: (data: ResultData) => void
  loadFromStorage: () => void
  resetAll: () => void
}

export const useResumeStore = create<ResumeState>((set) => ({
  userInput: {
    name: '',
    position: '',
    experience: '',
    jobPost: '',
    tone: '',
    briefIntro: '',
    phone: '',
    email: '',
    github: '',
    photo: new File([], ''),
    address: '',
    gender: '',
    birthDate: '',
    resultData: {
      introduction: '',
      experience: '',
    },
  },
  experiences: [],
  certifications: [],
  result: '',
    education: [],

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

  setEducation: (certs) => {
    localStorage.setItem('resume-education', JSON.stringify(certs))
    set({ education: certs })
  },

  setResult: (res) => set({ result: res }),

  setResultData: (data: ResultData) =>
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

    if (savedInput) {
      set({ userInput: JSON.parse(savedInput) })
    }
    if (savedExps) {
      set({ experiences: JSON.parse(savedExps) })
    }
    if (savedCerts) {
      set({ certifications: JSON.parse(savedCerts) })
    }
  },

  resetAll: () => {
    localStorage.removeItem('resume-userInput')
    localStorage.removeItem('resume-experiences')
    localStorage.removeItem('resume-certifications')
    set({
      userInput: {
        name: '',
        position: '',
        experience: '',
        jobPost: '',
        tone: '',
        briefIntro: '',
        phone: '',
        email: '',
        github: '',
    photo: new File([], ''),
        address: '',
        gender: '',
        birthDate: '',
        resultData: {
          introduction: '',
          experience: '',
        },
      },
      experiences: [],
      certifications: [],
      result: '',
    education: [],
    })
  },
}))
