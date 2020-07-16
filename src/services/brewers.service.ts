import {apiCall, buildUrl} from "./api.service";
import { BrewerDto} from "../models/";

export function getBrewers(): Promise<Array<BrewerDto>> {
    const request = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    return apiCall(buildUrl('brewers'), request)
}
export function getBrewer(brewerId: string): Promise<BrewerDto> {
    const request = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    return apiCall(buildUrl(`Brewers/${brewerId}`), request)
}

export function addBrewer(brewer: BrewerDto): Promise<BrewerDto> {
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(brewer)
    }
    return apiCall(buildUrl('brewers'), request)
}

export function editBrewer(brewer: BrewerDto): Promise<BrewerDto>  {
    const request = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(brewer)
    }
    return apiCall(buildUrl(`brewers/${brewer.id}`), request)
}

export function deleteBrewer(brewerId: string) {
    const request = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    return apiCall(buildUrl(`brewers/${brewerId}`), request)
}
