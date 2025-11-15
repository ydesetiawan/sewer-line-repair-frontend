export interface Contractor {
  id: string
  name: string
  city: string
  state: string
  address: string
  rating: number
  reviews: number
  specialty: 'Residential' | 'Commercial' | 'Both'
  price: '$' | '$$' | '$$$'
  phone: string
  badge: 'Premium' | 'Verified'
  email?: string
  website?: string
  serviceHours?: {
    day: string
    hours: string
  }[]
  photos?: string[]
  certifications?: string[]
  customerReviews?: {
    author: string
    rating: number
    text: string
    date: string
  }[]
}

// API Types for State Management
export interface Country {
  id: number
  name: string
  code: string
  slug: string
}

export interface StateAttributes {
  name: string
  code: string
  slug: string
  country: Country
}

export interface StateResource {
  id: string
  type: 'state'
  attributes: StateAttributes
}

export interface PaginationMeta {
  current_page: number
  prev_page: number | null
  next_page: number | null
  total_items: number
  total_pages: number
}

export interface ApiResponse<T> {
  data: T
  meta?: {
    pagination?: PaginationMeta
  }
}

export type StatesApiResponse = ApiResponse<StateResource[]>

