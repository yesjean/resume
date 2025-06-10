export interface UserInput {
  name: string
  position: string
  experience: string
  jobPost: string
  tone: 'logical' | 'emotional' | 'bold'
  experiences?: ExperienceItem[]  // 추가된 필드
}
interface ExperienceItem {
  title: string
  period: string
  activities: string
  learnings: string
}