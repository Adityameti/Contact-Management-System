import React from 'react'

function Chip({ children }) {
  return <span className="chip">{children}</span>
}

export default function ContactList({ contacts, onEdit, onDelete }) {
  if (!contacts.length) return <div className="muted">No contacts to display</div>

  return (
    <div className="list">
      {contacts.map(c => (
        <div key={c.id} className="card">
          <div className="card-main">
            <div className="title-row">
              <h3>{c.name}</h3>
              <div className="card-actions">
                <button className="secondary" onClick={() => onEdit(c)}>Edit</button>
                <button className="danger" onClick={() => onDelete(c.id)}>Delete</button>
              </div>
            </div>
            <div className="meta">
              <div>📧 {c.email}</div>
              <div>📱 {c.phone}</div>
              {c.company && <div>🏢 {c.company}</div>}
            </div>
            {Array.isArray(c.tags) && c.tags.length > 0 && (
              <div className="tags">
                {c.tags.map(t => <Chip key={t}>{t}</Chip>)}
              </div>
            )}
            {c.notes && <p className="notes">{c.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
