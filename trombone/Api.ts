export interface RequestReturn<T> {
    text?: string;
    code: number;
    json?: T;
    blob?: Blob;
    ok: boolean;
};

type Token = boolean | string | undefined

// https://masurao.fr/docs
const url = "https://masurao.fr/api";
const groupAuthorization = "qkRWGKs55LnaJUowf7VbzUUR4skcllAF"

export async function apiLogin(email: string, password: string): Promise<RequestReturn<{access_token: string}>> {
    const urlLogin = `${url}/employees/login`;

    try {
        const resp = await fetch(urlLogin, {
            method: "POST",
            headers: {
                "X-Group-Authorization" : groupAuthorization,
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
        return {code: 500, ok: false}
    }
}

async function myFetch(endpoint: string, token: Token, output: 'blob' | 'json' | 'text', body?: string, method: string = "GET"): Promise<RequestReturn<any>> {
    const resp = await fetch(endpoint, {
        method,
        headers: {
            "X-Group-Authorization" : "qkRWGKs55LnaJUowf7VbzUUR4skcllAF",
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body
    })
    if (resp.status !== 200) {
        console.log('resp', resp)
        return {code: 500, ok: false}
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
    return {code: 500, ok: false}
}

export async function apiImage(id: number, token: Token): Promise<RequestReturn<{}>> {
    const urlImage = `${url}/employees/${id}/image`;

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
    const urlMe = `${url}/employees/me`;

    try {
        const resp = await myFetch(urlMe, token, 'json')
        return resp
    } catch (error) {
        console.warn(error)
        return {code: 500, ok: false}
    }
}

export async function apiEmployee(id: number, token: Token): Promise<RequestReturn<EmployeeFull>> {
    const urlEmp = `${url}/employees/${id}`;

    try {
        const resp = await myFetch(urlEmp, token, 'json')
        return resp
    } catch (error) {
        console.warn(error)
        return {code: 500, ok: false}
    }
}

export async function apiEmployees(token: Token): Promise<RequestReturn<EmployeeSmall[]>> {
    const urlEmp = `${url}/employees`;

    try {
        const resp = await myFetch(urlEmp, token, 'json')
        return resp
    } catch (error) {
        console.warn(error)
        return {code: 500, ok: false}
    }
}

export async function apiLeaders(token: Token): Promise<RequestReturn<EmployeeSmall[]>> {
    const urlEmp = `${url}/employees/leaders`;

    try {
        const resp = await myFetch(urlEmp, token, 'json')
        return resp
    } catch (error) {
        console.warn(error)
        return {code: 500, ok: false}
    }
}
