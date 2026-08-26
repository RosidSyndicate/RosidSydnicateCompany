export type Project = {
  id: string
  slug: string
  title: string
  client: string
  location: string
  sector: 'Hydropower' | 'Transmission' | 'Civil Infrastructure' | 'Construction' | 'Procurement' | 'Supply' | 'Trade'
  projectType: string
  year: string
  shortDescription: string
  description: string
  scope: string
  images: string[]
  status: string
  results: string
}

export const projects: Project[] = []
