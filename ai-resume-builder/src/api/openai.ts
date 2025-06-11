import axios from 'axios'
import type { UserInput } from '../types/resume'

export const generateResumeSection = async (userInput: UserInput): Promise<string> => {
  const response = await axios.post(
    'https://resume-6mrx.onrender.com/api/generate',
    { userInput }
  )
  return response.data.result
}
