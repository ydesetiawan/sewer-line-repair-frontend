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