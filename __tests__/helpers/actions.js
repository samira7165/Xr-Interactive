export { adminSession } from './api'

export function buildFormData(fields) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null) formData.append(key, value)
  }
  return formData
}
