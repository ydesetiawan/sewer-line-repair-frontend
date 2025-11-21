// Company API Types
export type ServiceLevel = 'Basic' | 'Standard' | 'Premium' | 'Elite'

export interface ICompanyAttributes {
  name: string
  slug: string
  phone: string
  email: string
  website: string
  street_address: string
  zip_code: string
  latitude: string
  longitude: string
  description: string
  average_rating: string
  total_reviews: number
  verified_professional: boolean
  licensed: boolean
  insured: boolean
  background_checked: boolean
  certified_partner: boolean
  service_guarantee: boolean
  service_level: ServiceLevel
  specialty: string
  created_at: string
  updated_at: string
  url_path: string
  full_address: string
}

export interface ICompany {
  id: string
  type: 'company'
  attributes: ICompanyAttributes
}