
export function apiCall(url: string, request: any) {
    if (isAuthenticated()) {
        request.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
        return fetch(url, request)
            .then(response => {
                if (!response.ok ) {
                    throw Error(response.status + response.statusText)
                }
                return response.json();
            })
            .catch(err => {
                console.log(err);
                throw Error;
            })
    }
    throw Error('not logged in')
}

export function loginUser(credentials:{username: string, password: string}) {
    const request = {
        body: JSON.stringify(credentials),
        method: "POST",
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return fetch(buildUrl('authentication'), request as any)
        .then(response => {
            if (!response.ok ) {
                throw Error(response.status + response.statusText)
            }
            return response.json();
        })
        .then(response => {
            localStorage.setItem('token', response.token)
        })
        .catch(err => {
            console.log(err);
            throw Error;
        });
}

export function isAuthenticated() {
    return !!localStorage.getItem('token');
}

export function buildUrl(endpoint: string) {
    return process.env.REACT_APP_BACKEND_URL + endpoint;
}
