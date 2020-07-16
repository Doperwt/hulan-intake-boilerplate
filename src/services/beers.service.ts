import {apiCall, buildUrl} from "./api.service";
import {BeerDTO} from "../models/";

export function getBeers(): Promise<Array<BeerDTO>> {
    const request = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    return apiCall(buildUrl('beers'), request);
}

export function getBeer(beerId: string): Promise<BeerDTO> {
    const request = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    return apiCall(buildUrl(`beers/${beerId}`), request)
}

export function addBeer(beer: BeerDTO) {
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(beer)
    }
    return apiCall(buildUrl('beers'), request)
}

export function editBeer(beer: BeerDTO) {
    const request = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(beer)
    }
    return apiCall(buildUrl(`beers/${beer.id}`), request)
}

export function deleteBeer(beerId: string) {
    const request = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    return apiCall(buildUrl(`beers/${beerId}`), request)
}
