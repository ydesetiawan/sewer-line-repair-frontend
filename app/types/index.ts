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

