export interface Contractor {
  id: string
  name: string
  city: string
  state: string
  address: string
  rating: number
  reviews: number
  specialty: "Residential" | "Commercial" | "Both"
  price: "$" | "$$" | "$$$"
  phone: string
  badge: "Premium" | "Verified"
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

export const CONTRACTORS: Contractor[] = [
  // California
  {
    id: "j-sewer-and-drain",
    name: "J Sewer & Drain Plumbing",
    city: "Los Angeles",
    state: "California",
    address: "1234 Main St, Los Angeles, CA 90001",
    rating: 4.9,
    reviews: 156,
    specialty: "Both",
    price: "$$$",
    phone: "(213) 555-0101",
    badge: "Premium",
    serviceHours: [
      { day: "Monday - Friday", hours: "7:00 AM - 6:00 PM" },
      { day: "Saturday", hours: "8:00 AM - 4:00 PM" },
      { day: "Sunday", hours: "Emergency Only" },
    ],
    photos: ["/sewer-repair-truck.jpg", "/drain-cleaning-equipment.jpg", "/plumbing-team.png"],
    certifications: ["Licensed Plumber", "Bonded & Insured", "EPA Certified", "OSHA Certified"],
    customerReviews: [
      {
        author: "John D.",
        rating: 5,
        text: "Excellent service! Fixed our sewer line issue quickly and professionally. Highly recommend!",
        date: "2024-10-15",
      },
      {
        author: "Sarah M.",
        rating: 5,
        text: "Very professional and affordable. Great customer service from start to finish.",
        date: "2024-10-10",
      },
      {
        author: "Mike K.",
        rating: 4,
        text: "Good work, arrived on time. Would use again.",
        date: "2024-09-28",
      },
    ],
  },
  {
    id: "expert-sewer-solutions",
    name: "Expert Sewer Solutions",
    city: "Los Angeles",
    state: "California",
    address: "5678 Broadway Ave, Los Angeles, CA 90005",
    rating: 4.8,
    reviews: 124,
    specialty: "Residential",
    price: "$$$",
    phone: "(213) 555-0102",
    badge: "Premium",
    serviceHours: [
      { day: "Monday - Friday", hours: "6:00 AM - 8:00 PM" },
      { day: "Saturday", hours: "7:00 AM - 5:00 PM" },
      { day: "Sunday", hours: "By Appointment" },
    ],
    photos: ["/professional-drain-service.jpg", "/sewer-line-inspection.jpg"],
    certifications: ["Master Plumber", "Bonded & Insured", "Water Quality Certified"],
    customerReviews: [
      {
        author: "Lisa R.",
        rating: 5,
        text: "Outstanding service! The team was punctual and courteous.",
        date: "2024-10-12",
      },
      {
        author: "Robert T.",
        rating: 4,
        text: "Professional and efficient. Fair pricing.",
        date: "2024-10-01",
      },
    ],
  },
  {
    id: "quickfix-plumbing",
    name: "QuickFix Plumbing",
    city: "San Francisco",
    state: "California",
    address: "910 Market St, San Francisco, CA 94102",
    rating: 4.6,
    reviews: 89,
    specialty: "Residential",
    price: "$$",
    phone: "(415) 555-0103",
    badge: "Verified",
    serviceHours: [
      { day: "Monday - Friday", hours: "8:00 AM - 5:00 PM" },
      { day: "Saturday", hours: "9:00 AM - 3:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
    photos: ["/residential-plumbing.jpg"],
    certifications: ["Licensed Plumber", "Insured"],
    customerReviews: [
      {
        author: "Emma W.",
        rating: 5,
        text: "Fast and reliable service!",
        date: "2024-10-08",
      },
    ],
  },
  {
    id: "pro-drain-sf",
    name: "Professional Drain & Sewer",
    city: "San Francisco",
    state: "California",
    address: "2030 Mission St, San Francisco, CA 94110",
    rating: 4.7,
    reviews: 112,
    specialty: "Commercial",
    price: "$$$",
    phone: "(415) 555-0104",
    badge: "Premium",
    serviceHours: [
      { day: "Monday - Friday", hours: "7:00 AM - 7:00 PM" },
      { day: "Saturday", hours: "8:00 AM - 5:00 PM" },
      { day: "Sunday", hours: "Emergency Only" },
    ],
    photos: ["/commercial-drain-service.jpg"],
    certifications: ["Licensed Plumber", "Bonded & Insured", "Commercial Specialist"],
    customerReviews: [
      {
        author: "Alex P.",
        rating: 5,
        text: "Best commercial plumbing service in SF!",
        date: "2024-10-05",
      },
    ],
  },
  {
    id: "rapid-response-san-diego",
    name: "Rapid Response Sewer Co",
    city: "San Diego",
    state: "California",
    address: "3456 Park Blvd, San Diego, CA 92103",
    rating: 4.4,
    reviews: 45,
    specialty: "Residential",
    price: "$$",
    phone: "(619) 555-0105",
    badge: "Verified",
    serviceHours: [
      { day: "Monday - Saturday", hours: "8:00 AM - 6:00 PM" },
      { day: "Sunday", hours: "10:00 AM - 4:00 PM" },
    ],
    photos: ["/rapid-response-plumbing.jpg"],
    certifications: ["Licensed Plumber", "Insured"],
    customerReviews: [
      {
        author: "Chris L.",
        rating: 4,
        text: "Good response time, professional work.",
        date: "2024-09-20",
      },
    ],
  },
  // New York
  {
    id: "nyc-sewer-masters",
    name: "NYC Sewer Masters",
    city: "New York",
    state: "New York",
    address: "123 5th Ave, New York, NY 10003",
    rating: 4.8,
    reviews: 198,
    specialty: "Both",
    price: "$$$",
    phone: "(212) 555-0106",
    badge: "Premium",
    serviceHours: [
      { day: "Monday - Friday", hours: "7:00 AM - 9:00 PM" },
      { day: "Saturday", hours: "8:00 AM - 6:00 PM" },
      { day: "Sunday", hours: "Emergency 24/7" },
    ],
    photos: ["/nyc-sewer-masters-team.jpg", "/professional-drain-cleaning.png"],
    certifications: ["Master Plumber", "Bonded & Insured", "NYC Licensed", "Emergency Certified"],
    customerReviews: [
      {
        author: "David S.",
        rating: 5,
        text: "NYC's best! Fast, professional, and fair pricing.",
        date: "2024-10-18",
      },
      {
        author: "Maria G.",
        rating: 5,
        text: "Solved our sewer problem in one visit. Excellent!",
        date: "2024-10-10",
      },
    ],
  },
  {
    id: "brooklyn-drain-experts",
    name: "Brooklyn Drain Experts",
    city: "Brooklyn",
    state: "New York",
    address: "456 Atlantic Ave, Brooklyn, NY 11217",
    rating: 4.5,
    reviews: 67,
    specialty: "Residential",
    price: "$$",
    phone: "(718) 555-0107",
    badge: "Verified",
    serviceHours: [
      { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
      { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
    photos: ["/brooklyn-plumbing-service.jpg"],
    certifications: ["Licensed Plumber", "Bonded"],
    customerReviews: [
      {
        author: "Jennifer H.",
        rating: 4,
        text: "Good service, reasonable prices.",
        date: "2024-09-25",
      },
    ],
  },
  {
    id: "advanced-pipe-systems",
    name: "Advanced Pipe Systems",
    city: "Buffalo",
    state: "New York",
    address: "789 Main St, Buffalo, NY 14202",
    rating: 4.7,
    reviews: 102,
    specialty: "Commercial",
    price: "$$$",
    phone: "(716) 555-0108",
    badge: "Premium",
    serviceHours: [
      { day: "Monday - Friday", hours: "7:00 AM - 6:00 PM" },
      { day: "Saturday - Sunday", hours: "By Appointment" },
    ],
    photos: ["/commercial-pipe-systems.jpg"],
    certifications: ["Commercial Plumbing Specialist", "Bonded & Insured", "Advanced Systems Certified"],
    customerReviews: [
      {
        author: "Paul N.",
        rating: 5,
        text: "Top-notch commercial plumbing services!",
        date: "2024-10-02",
      },
    ],
  },
  // Texas
  {
    id: "houston-sewer-service",
    name: "Houston Sewer Service",
    city: "Houston",
    state: "Texas",
    address: "234 Main St, Houston, TX 77002",
    rating: 4.6,
    reviews: 143,
    specialty: "Both",
    price: "$$",
    phone: "(713) 555-0109",
    badge: "Premium",
    serviceHours: [
      { day: "Monday - Friday", hours: "7:00 AM - 7:00 PM" },
      { day: "Saturday", hours: "8:00 AM - 5:00 PM" },
      { day: "Sunday", hours: "Emergency Only" },
    ],
    photos: ["/houston-sewer-service.jpg"],
    certifications: ["Licensed Plumber", "Bonded & Insured", "Texas Certified"],
    customerReviews: [
      {
        author: "Tom B.",
        rating: 5,
        text: "Excellent service, fast response!",
        date: "2024-10-14",
      },
    ],
  },
  {
    id: "dallas-drain-solutions",
    name: "Dallas Drain Solutions",
    city: "Dallas",
    state: "Texas",
    address: "567 Commerce St, Dallas, TX 75202",
    rating: 4.9,
    reviews: 175,
    specialty: "Both",
    price: "$$$",
    phone: "(214) 555-0110",
    badge: "Premium",
    serviceHours: [
      { day: "Monday - Friday", hours: "6:00 AM - 8:00 PM" },
      { day: "Saturday", hours: "7:00 AM - 6:00 PM" },
      { day: "Sunday", hours: "Emergency 24/7" },
    ],
    photos: ["/dallas-drain-solutions.jpg"],
    certifications: ["Master Plumber", "Bonded & Insured", "EPA Certified"],
    customerReviews: [
      {
        author: "Rachel C.",
        rating: 5,
        text: "Best drain service in Dallas!",
        date: "2024-10-16",
      },
    ],
  },
  {
    id: "austin-pipe-repair",
    name: "Austin Pipe Repair",
    city: "Austin",
    state: "Texas",
    address: "890 Congress Ave, Austin, TX 78701",
    rating: 4.3,
    reviews: 38,
    specialty: "Residential",
    price: "$",
    phone: "(512) 555-0111",
    badge: "Verified",
    serviceHours: [
      { day: "Monday - Friday", hours: "9:00 AM - 5:00 PM" },
      { day: "Saturday", hours: "10:00 AM - 3:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
    photos: ["/austin-pipe-repair.jpg"],
    certifications: ["Licensed Plumber", "Insured"],
    customerReviews: [
      {
        author: "Kevin M.",
        rating: 4,
        text: "Affordable and reliable!",
        date: "2024-09-30",
      },
    ],
  },
  // Florida
  {
    id: "miami-drain-pros",
    name: "Miami Drain Pros",
    city: "Miami",
    state: "Florida",
    address: "111 Biscayne Blvd, Miami, FL 33132",
    rating: 4.7,
    reviews: 95,
    specialty: "Both",
    price: "$$",
    phone: "(305) 555-0112",
    badge: "Premium",
    serviceHours: [
      { day: "Monday - Saturday", hours: "7:00 AM - 8:00 PM" },
      { day: "Sunday", hours: "9:00 AM - 5:00 PM" },
    ],
    photos: ["/miami-drain-service.jpg"],
    certifications: ["Licensed Plumber", "Bonded & Insured", "Florida Certified"],
    customerReviews: [
      {
        author: "Angela F.",
        rating: 5,
        text: "Fantastic service, highly recommended!",
        date: "2024-10-11",
      },
    ],
  },
  {
    id: "orlando-sewer-repair",
    name: "Orlando Sewer Repair",
    city: "Orlando",
    state: "Florida",
    address: "222 Orange Ave, Orlando, FL 32801",
    rating: 4.5,
    reviews: 68,
    specialty: "Residential",
    price: "$$",
    phone: "(407) 555-0113",
    badge: "Verified",
    serviceHours: [
      { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
      { day: "Saturday - Sunday", hours: "By Appointment" },
    ],
    photos: ["/orlando-sewer-repair.jpg"],
    certifications: ["Licensed Plumber", "Bonded"],
    customerReviews: [
      {
        author: "Susan V.",
        rating: 4,
        text: "Professional and courteous!",
        date: "2024-10-03",
      },
    ],
  },
  // Illinois
  {
    id: "chicago-pipe-masters",
    name: "Chicago Pipe Masters",
    city: "Chicago",
    state: "Illinois",
    address: "333 State St, Chicago, IL 60602",
    rating: 4.8,
    reviews: 187,
    specialty: "Both",
    price: "$$$",
    phone: "(312) 555-0114",
    badge: "Premium",
    serviceHours: [
      { day: "Monday - Friday", hours: "7:00 AM - 8:00 PM" },
      { day: "Saturday", hours: "8:00 AM - 6:00 PM" },
      { day: "Sunday", hours: "Emergency Only" },
    ],
    photos: ["/placeholder.svg?height=300&width=400"],
    certifications: ["Master Plumber", "Bonded & Insured", "Chicago Licensed"],
    customerReviews: [
      {
        author: "Mark J.",
        rating: 5,
        text: "Top Chicago plumbing service!",
        date: "2024-10-19",
      },
    ],
  },
  {
    id: "chicago-drain-solutions",
    name: "Chicago Drain Solutions",
    city: "Chicago",
    state: "Illinois",
    address: "444 Michigan Ave, Chicago, IL 60611",
    rating: 4.6,
    reviews: 74,
    specialty: "Commercial",
    price: "$$$",
    phone: "(312) 555-0115",
    badge: "Verified",
    serviceHours: [
      { day: "Monday - Friday", hours: "7:00 AM - 6:00 PM" },
      { day: "Saturday - Sunday", hours: "By Appointment" },
    ],
    photos: ["/placeholder.svg?height=300&width=400"],
    certifications: ["Commercial Plumbing", "Bonded & Insured"],
    customerReviews: [
      {
        author: "Patricia O.",
        rating: 5,
        text: "Great commercial plumbing solutions!",
        date: "2024-10-07",
      },
    ],
  },
  // Pennsylvania
  {
    id: "philly-sewer-service",
    name: "Philadelphia Sewer Service",
    city: "Philadelphia",
    state: "Pennsylvania",
    address: "555 Market St, Philadelphia, PA 19106",
    rating: 4.9,
    reviews: 156,
    specialty: "Both",
    price: "$$$",
    phone: "(215) 555-0116",
    badge: "Premium",
    serviceHours: [
      { day: "Monday - Friday", hours: "7:00 AM - 7:00 PM" },
      { day: "Saturday", hours: "8:00 AM - 5:00 PM" },
      { day: "Sunday", hours: "Emergency Only" },
    ],
    photos: ["/placeholder.svg?height=300&width=400"],
    certifications: ["Master Plumber", "Bonded & Insured", "Philadelphia Licensed"],
    customerReviews: [
      {
        author: "James B.",
        rating: 5,
        text: "Excellent service in Philadelphia!",
        date: "2024-10-13",
      },
    ],
  },
  {
    id: "pittsburgh-drain-experts",
    name: "Pittsburgh Drain Experts",
    city: "Pittsburgh",
    state: "Pennsylvania",
    address: "666 Fifth Ave, Pittsburgh, PA 15219",
    rating: 4.4,
    reviews: 52,
    specialty: "Residential",
    price: "$$",
    phone: "(412) 555-0117",
    badge: "Verified",
    serviceHours: [
      { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
      { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
    photos: ["/placeholder.svg?height=300&width=400"],
    certifications: ["Licensed Plumber", "Insured"],
    customerReviews: [
      {
        author: "Lisa A.",
        rating: 4,
        text: "Good work and fair prices!",
        date: "2024-09-22",
      },
    ],
  },
  // Arizona
  {
    id: "phoenix-sewer-pro",
    name: "Phoenix Sewer Pro",
    city: "Phoenix",
    state: "Arizona",
    address: "777 Central Ave, Phoenix, AZ 85004",
    rating: 4.7,
    reviews: 118,
    specialty: "Both",
    price: "$$",
    phone: "(602) 555-0118",
    badge: "Premium",
    serviceHours: [
      { day: "Monday - Saturday", hours: "7:00 AM - 6:00 PM" },
      { day: "Sunday", hours: "9:00 AM - 4:00 PM" },
    ],
    photos: ["/placeholder.svg?height=300&width=400"],
    certifications: ["Licensed Plumber", "Bonded & Insured", "Arizona Certified"],
    customerReviews: [
      {
        author: "Daniel E.",
        rating: 5,
        text: "Best plumber in Phoenix!",
        date: "2024-10-17",
      },
    ],
  },
  // Georgia
  {
    id: "atlanta-drain-masters",
    name: "Atlanta Drain Masters",
    city: "Atlanta",
    state: "Georgia",
    address: "888 Peach St, Atlanta, GA 30303",
    rating: 4.6,
    reviews: 94,
    specialty: "Both",
    price: "$$",
    phone: "(404) 555-0119",
    badge: "Verified",
    serviceHours: [
      { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
      { day: "Saturday", hours: "9:00 AM - 3:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
    photos: ["/placeholder.svg?height=300&width=400"],
    certifications: ["Licensed Plumber", "Bonded & Insured", "Georgia Certified"],
    customerReviews: [
      {
        author: "Nicole T.",
        rating: 5,
        text: "Fantastic Atlanta drain service!",
        date: "2024-10-09",
      },
    ],
  },
]

export const STATES = ["California", "New York", "Texas", "Florida", "Illinois", "Pennsylvania", "Arizona", "Georgia"]

export function getSlug(type: string): string | null {
    if (type === null) return null

    return type.toLowerCase().replace(/\s+/g, "-")
}

export function getStateSlug(state: string): string {
  return state.toLowerCase().replace(/\s+/g, "-")
}

export function getCitySlug(city: string): string {
  return city.toLowerCase().replace(/\s+/g, "-")
}

export function getProviderSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

export function getContractorsByState(state: string): Contractor[] {
  return CONTRACTORS.filter((c) => c.state === state)
}

export function getContractorsByCity(state: string, city: string): Contractor[] {
  return CONTRACTORS.filter((c) => c.state === state && c.city === city)
}

export function getCitiesByState(state: string): string[] {
  return [...new Set(CONTRACTORS.filter((c) => c.state === state).map((c) => c.city))]
}

export function getContractorById(id: string): Contractor | undefined {
  return CONTRACTORS.find((c) => c.id === id)
}

export function getCountry(countrySlug: string): string | null {
    return countrySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}
