
export class ApiHelper {
  
  static apiGet<T>(url: string): Promise<T> {
    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        return response.json() as Promise<T>
      })
  }

  static apiPost<T>(url: string, jsonData: string): Promise<T> {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: jsonData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        return response.json() as Promise<T>
      })
  }
}