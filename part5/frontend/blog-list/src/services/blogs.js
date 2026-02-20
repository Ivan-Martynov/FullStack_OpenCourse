import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (sourceToken) => {
  token = `Bearer ${sourceToken}`
}

const isTokenExpired = (targetToken) => {
  if (!targetToken) {
    return true
  }

  try {
    const payload = JSON.parse(atob(targetToken.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = async (newObject) => {
  const config = {
    headers: {
      Authorization: token,
    },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const config = {
    headers: {
      Authorization: token,
    },
  }

  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

export default { getAll, create, update, setToken, isTokenExpired }
