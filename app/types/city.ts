
export interface ICityAttributes {
  name: string
  slug: string
  companies_count: number
  country: {
    id: number
    name: string
    code: string
    slug: string
  }
  state: {
    id: number
    name: string
    code: string
    slug: string
  }
}

export interface ICity {
  id: string
  type: 'city'
  attributes: ICityAttributes
}