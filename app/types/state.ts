export interface ICountry {
  id: number
  name: string
  code: string
  slug: string
}

export interface IStateAttributes {
  name: string
  code: string
  slug: string
  companies_count: number
  country: ICountry
}

export interface IState {
  id: string
  type: 'state'
  attributes: IStateAttributes
}