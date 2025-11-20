import type {LocationResource} from "@/types/index";

export interface ILocationAttributes {
    country: string;
    state: string;
    city: string;
    address: string;

}
export interface ILocation {
    id: string;
    type: string;
    attributes: ILocationAttributes
}

export interface ILocationAutocompleteOptions {
    limit?: number
    minChars?: number
    debounceMs?: number
}

export interface ILocationAutocompleteReturn {
    locations: Ref<ILocation[]>
    loading: Ref<boolean>
    error: Ref<Error | null>
    meta: Ref<{ query: string; count: number; limit: number } | null>
    search: (query: string) => Promise<void>
    clearResults: () => void
}