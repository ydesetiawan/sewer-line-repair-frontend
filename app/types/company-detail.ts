/**
 * Company Detail Type Definitions
 * API Response structure for company details endpoint
 */

export interface IServiceCategory {
  id: number
  name: string
  slug: string
  description: string
}

export interface ICompanyReview {
  id: string
  rating: number
  comment: string
  author: string
  created_at: string
}

export interface IWorkingHours {
  Monday: string
  Tuesday: string
  Wednesday: string
  Thursday: string
  Friday: string
  Saturday: string
  Sunday: string
}

export interface ICompanyDetailAttributes {
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
  service_level: 'Basic' | 'Standard' | 'Premium' | 'Elite'
  specialty: string
  working_hours: IWorkingHours
  created_at: string
  updated_at: string
  url_path: string
  full_address: string
  service_categories: IServiceCategory[]
  reviews: ICompanyReview[]
}

export interface ICompanyDetail {
  id: string
  type: string
  attributes: ICompanyDetailAttributes
}

export interface ICompanyDetailResponse {
  data: ICompanyDetail
}

