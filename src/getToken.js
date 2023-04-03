import { tokenUrl, otp } from '../config.json'

export default async function getToken() {
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...otp })
  })

  const { token } = await response.json()

  return token
}
