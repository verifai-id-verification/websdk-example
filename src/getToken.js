import { tokenUrl } from '../config.json'

export default async function getToken() {
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_type_whitelist: ['P', 'I'] }) // TODO: Remove `document_type_whitelist` as it should use default from back end.
  })

  const { token } = await response.json()

  return token
}
