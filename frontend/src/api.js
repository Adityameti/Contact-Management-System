const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export async function fetchContacts(q = '') {
  const url = new URL(`${API_BASE}/api/contacts`)
  if (q) url.searchParams.set('q', q)
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch contacts')
  return res.json()
}

export async function createContact(data) {
  const res = await fetch(`${API_BASE}/api/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error((await res.json()).errors?.join(', ') || 'Create failed')
  return res.json()
}

export async function updateContact(id, data) {
  const res = await fetch(`${API_BASE}/api/contacts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error((await res.json()).errors?.join(', ') || 'Update failed')
  return res.json()
}

export async function deleteContact(id) {
  const res = await fetch(`${API_BASE}/api/contacts/${id}`, { method: 'DELETE' })
  if (!res.ok && res.status !== 204) throw new Error('Delete failed')
}
