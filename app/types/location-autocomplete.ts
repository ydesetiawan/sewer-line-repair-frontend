import type {LocationResource} from "@/types/index";

export interface ILocationAutocompleteAttributes {
    country: string;
    state: string;
    city: string;
    address: string;

}
export interface ILocationAutocomplete {
    id: string;
    type: string;
    attributes: ILocationAutocompleteAttributes
}

export interface ILocationAutocompleteOptions {
    limit?: number
    minChars?: number
    debounceMs?: number
}

export interface ILocationAutocompleteReturn {
    locations: Ref<ILocationAutocomplete[]>
    loading: Ref<boolean>
    error: Ref<Error | null>
    meta: Ref<{ query: string; count: number; limit: number } | null>
    search: (query: string) => Promise<void>
    clearResults: () => void
}