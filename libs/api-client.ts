type ErrorResponse = {
  status: number
  error: string
}

export const fetchHelper = async <T>(
  path: string,
  config: RequestInit,
): Promise<T | ErrorResponse> => {
  const request = new Request(path, config)
  let response: Response

  try {
    response = await fetch(request)
  } catch (error) {
    return { status: 0, error: `API error: ${error}` }
  }

  if (!response.ok) {
    return { status: response.status, error: response.statusText }
  }

  return response.json()
}

async function get<T>(path: string, config?: RequestInit) {
  const options = { method: 'GET', ...config }

  return fetchHelper<T>(path, options)
}

async function post<T, U>(path: string, body: T, config?: RequestInit) {
  const options = { method: 'POST', body: JSON.stringify(body), ...config }

  return fetchHelper<U>(path, options)
}

async function put<T, U>(path: string, body: T, config?: RequestInit) {
  const options = { method: 'PUT', body: JSON.stringify(body), ...config }

  return fetchHelper<U>(path, options)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete<T>(path: string) {
  const options = {
    method: 'DELETE',
  }
  return fetchHelper<T>(path, options)
}

const apiClient = {
  get,
  post,
  put,
  delete: _delete,
}

export default apiClient
