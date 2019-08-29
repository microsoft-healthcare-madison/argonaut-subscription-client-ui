
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
          throw new Error(response.statusText);
        }
        return response.json() as Promise<T>;
      })
  }

  static apiGetFhir<T>(url: string): Promise<T> {
    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/fhir+json',
      },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<T>;
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
          throw new Error(response.statusText);
        }
        return response.json() as Promise<T>;
      })
  }

  static apiPostFhir<T>(url: string, jsonData: string): Promise<T> {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/fhir+json; charset=utf-8',
        'Content-Type': 'application/fhir+json; charset=utf-8',
        'Prefer':'return=representation',
      },
      body: jsonData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<T>;
      })
  }

  static apiPutFhir<T>(url: string, jsonData: string): Promise<T> {
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/fhir+json',
        'Content-Type': 'application/fhir+json',
      },
      body: jsonData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<T>;
      })
  }

  static apiPut<T>(url: string, jsonData: string): Promise<T> {
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: jsonData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<T>;
      })
  }

  static apiDelete(url: string): Promise<boolean> {
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return true;
      })
      .catch(reason => {
        return false;
      })
  }

  static deleteSubscription(id: string, serverUrl: string) {
    if (!(id) || (id === '')) { return; }
    if (!(serverUrl) || (serverUrl === '')) { return; }

		// **** build url to remove the subscription ****

		let url:string = new URL(`Subscription/${encodeURIComponent(id)}`, serverUrl).toString();

		// **** ask for this subscription to be deleted ****

		ApiHelper.apiDelete(url);
  }

  static deleteEndpoint(clientRegistration: string, id: string, clientHostUrl: string) {
    if (!(clientRegistration) || (clientRegistration === '')) { return; }
    if (!(id) || (id === '')) { return; }
    if (!(clientHostUrl) || (clientHostUrl === '')) { return; }

		// **** build the URL to delete the endpoint ****

		let url: string = new URL(
			`api/Clients/${encodeURIComponent(clientRegistration)}/Endpoints/${encodeURIComponent(id)}/`, 
			clientHostUrl
      ).toString();
      
    // **** ask for this endpoint to be deleted ****

		ApiHelper.apiDelete(url);
  }
}