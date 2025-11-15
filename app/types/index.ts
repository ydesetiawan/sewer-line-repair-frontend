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
  companies_count: number
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

// Location Autocomplete API Types
export interface LocationAttributes {
  country: string
  state: string
  city: string
  address: string | null
}

export interface LocationResource {
  id: number
  type: 'city'
  attributes: LocationAttributes
}

export interface AutocompleteMeta {
  query: string
  count: number
  limit: number
}

export type LocationAutocompleteResponse = ApiResponse<LocationResource[]> & {
  meta: AutocompleteMeta
}

// Company API Types
export type ServiceLevel = 'Basic' | 'Standard' | 'Premium' | 'Elite'

export interface CompanyAttributes {
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

export interface CompanyResource {
  id: string
  type: 'company'
  attributes: CompanyAttributes
}

export interface CityAttributes {
  name: string
  slug: string
  companies_count: number
  country: Country
  state: {
    id: number
    name: string
    code: string
    slug: string
  }
}

export interface CityResource {
  id: string
  type: 'city'
  attributes: CityAttributes
}

export interface CompaniesMeta {
  cities: {
    data: CityResource[]
  }
  pagination: PaginationMeta
}

export type CompaniesApiResponse = ApiResponse<CompanyResource[]> & {
  meta: CompaniesMeta
}

