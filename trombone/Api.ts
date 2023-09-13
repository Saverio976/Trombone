import { XGROUPAUTHORIZATION, API_URL } from "@env";

export interface RequestReturn<T> {
    text?: string;
    code: number;
    json?: T;
    blob?: Blob;
    ok: boolean;
    error?: any
    errorDetail?: { url: string, body?: string, method: string}
};

type Token = boolean | string | undefined

// https://masurao.fr/docs
async function getUrlApi() {
    return API_URL
}
// https://masurao.fr/docs
async function getGroupAuthorization() {
    return XGROUPAUTHORIZATION
}

export async function apiLogin(email: string, password: string): Promise<RequestReturn<{access_token: string}>> {
    const urlLogin = `${await getUrlApi()}/employees/login`;

    try {
        const resp = await fetch(urlLogin, {
            method: "POST",
            headers: {
                "X-Group-Authorization" : await getGroupAuthorization(),
                "accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        if (resp.status !== 200) {
            return {code: 500, ok: false}
        }
        return {code: 200, ok: true, json: await resp.json()}
    } catch (error) {
        const detail = {
            url: urlLogin,
            method: "post",
        }
        console.error(error)
        return {code: 500, ok: false, error, errorDetail: detail}
    }
}

async function myFetch(endpoint: string, token: Token, output: 'blob' | 'json' | 'text', body?: string, method: string = "GET"): Promise<RequestReturn<any>> {
    try {
        const resp = await fetch(endpoint, {
            method,
            headers: {
                "X-Group-Authorization" : await getGroupAuthorization(),
                "accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body
        })
            if (resp.status !== 200) {
                console.log('resp', resp)
                return {code: resp.status, ok: false, error: resp.statusText}
            }
            if (output === 'blob') {
                return {code: 200, ok: true, blob: await resp.blob()}
            }
            if (output === 'json') {
                return {code: 200, ok: true, json: await resp.json()}
            }
            if (output === 'text') {
                return {code: 200, ok: true, text: await resp.text()}
            }
            return {code: 500, ok: false, error: "Unknown response type"}
    } catch (error) {
        const detail = {
            url: endpoint,
            method,
            body,
        }
        return {code: 500, ok: false, error, errorDetail: detail}
    }
}

export async function apiImage(id: number, token: Token): Promise<RequestReturn<{}>> {
    const urlImage = `${await getUrlApi()}/employees/${id}/image`;

    try {
        const resp = await myFetch(urlImage, token, 'blob')
        return resp
    } catch (error) {
        console.warn(error)
        return {code: 500, ok: false}
    }
}

export type EmployeeFull = {
    id: number,
    email: string,
    name: string,
    surname: string,
    birth_date: string,
    gender: string,
    work: string,
    subordinates: number[],
};

export type EmployeeSmall = {
    id: number,
    email: string,
    name: string,
    surname: string,
};

export async function apiMe(token: Token): Promise<RequestReturn<EmployeeFull>> {
    const urlMe = `${await getUrlApi()}/employees/me`;

    try {
        const resp = await myFetch(urlMe, token, 'json')
        return resp
    } catch (error) {
        console.warn(error)
        return {code: 500, ok: false}
    }
}

export async function apiEmployee(id: number, token: Token): Promise<RequestReturn<EmployeeFull>> {
    const urlEmp = `${await getUrlApi()}/employees/${id}`;

    try {
        const resp = await myFetch(urlEmp, token, 'json')
        return resp
    } catch (error) {
        console.warn(error)
        return {code: 500, ok: false}
    }
}

export async function apiEmployees(token: Token): Promise<RequestReturn<EmployeeSmall[]>> {
    const urlEmp = `${await getUrlApi()}/employees`;

    try {
        const resp = await myFetch(urlEmp, token, 'json')
        return resp
    } catch (error) {
        console.warn(error)
        return {code: 500, ok: false}
    }
}

export async function apiLeaders(token: Token): Promise<RequestReturn<EmployeeSmall[]>> {
    const urlEmp = `${await getUrlApi()}/employees/leaders`;

    try {
        const resp = await myFetch(urlEmp, token, 'json')
        return resp
    } catch (error) {
        console.warn(error)
        return {code: 500, ok: false}
    }
}
