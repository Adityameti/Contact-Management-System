import React, { useEffect, useState } from 'react'
import { fetchContacts, createContact, updateContact, deleteContact } from './api'
import SearchBar from './components/SearchBar'
import ContactForm from './components/ContactForm'
import ContactList from './components/ContactList'

export default function App() {
  const [q, setQ] = useState('')
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)

  async function load() {
    try {
      setLoading(true)
      const data = await fetchContacts(q)
      setContacts(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [q])

  async function handleCreate(values) {
    try {
      await createContact(values)
      setQ('')
      await load()
    } catch (e) { setError(e.message) }
  }

  async function handleUpdate(id, values) {
    try {
      await updateContact(id, values)
      setEditing(null)
      await load()
    } catch (e) { setError(e.message) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this contact?')) return
    try {
      await deleteContact(id)
      await load()
    } catch (e) { setError(e.message) }
  }

  return (
    <div className="container">
      <header>
        <h1>Contact Management System</h1>
        <p className="subtitle">The past,present and future is in your contacts!</p>
      </header>

      <section className="panel responsive">
        <div className="panel-section">
          <h2>Add Contact</h2>
          <ContactForm onSubmit={handleCreate} />
        </div>
        <div className="panel-section">
          <h2>Search</h2>
          <SearchBar value={q} onChange={setQ} placeholder="Search by name, email, company, or tags" />
          <div className="list-header">
            <span><strong>{contacts.length}</strong> contacts</span>
            {loading && <span className="muted">Loading…</span>}
            {error && <span className="error">{error}</span>}
          </div>
          <ContactList contacts={contacts} onEdit={setEditing} onDelete={handleDelete} />
        </div>
      </section>

      {editing && (
        <section className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Contact</h3>
              <button className="icon" onClick={() => setEditing(null)}>✕</button>
            </div>
            <ContactForm initialValues={editing} onSubmit={(v) => handleUpdate(editing.id, v)} onCancel={() => setEditing(null)} />
          </div>
        </section>
      )}

      <footer>
        <small>Built with love, for Yakria by Aditya</small>
      </footer>
    </div>
  )
}
