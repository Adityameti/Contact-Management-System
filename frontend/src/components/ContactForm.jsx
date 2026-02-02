import React, { useEffect, useState } from 'react'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const empty = { name: '', email: '', phone: '', company: '', tags: '', notes: '' }

export default function ContactForm({ initialValues, onSubmit, onCancel }) {
  const [values, setValues] = useState(empty)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialValues) {
      setValues({
        name: initialValues.name || '',
        email: initialValues.email || '',
        phone: initialValues.phone || '',
        company: initialValues.company || '',
        tags: Array.isArray(initialValues.tags) ? initialValues.tags.join(', ') : '',
        notes: initialValues.notes || ''
      })
    } else {
      setValues(empty)
    }
  }, [initialValues])

  function validate(v) {
    const e = {}
    if (!v.name.trim()) e.name = 'Name is required'
    if (!v.email.trim()) e.email = 'Email is required'
    else if (!emailRegex.test(v.email.trim())) e.email = 'Invalid email'
    if (!v.phone.trim()) e.phone = 'Phone is required'
    else if (v.phone.replace(/\D/g, '').length < 7) e.phone = 'Phone looks invalid'
    return e
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate(values)
    setErrors(e)
    if (Object.keys(e).length) return
    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      company: values.company.trim(),
      tags: values.tags.split(',').map(s => s.trim()).filter(Boolean),
      notes: values.notes
    }
    onSubmit(payload)
    if (!initialValues) setValues(empty)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="grid">
        <div>
          <label>Name *</label>
          <input className={errors.name ? 'invalid' : ''} value={values.name} onChange={e => setValues({ ...values, name: e.target.value })} />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div>
          <label>Email *</label>
          <input type="email" className={errors.email ? 'invalid' : ''} value={values.email} onChange={e => setValues({ ...values, email: e.target.value })} />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div>
          <label>Phone *</label>
          <input className={errors.phone ? 'invalid' : ''} value={values.phone} onChange={e => setValues({ ...values, phone: e.target.value })} />
          {errors.phone && <div className="error">{errors.phone}</div>}
        </div>
        <div>
          <label>Company</label>
          <input value={values.company} onChange={e => setValues({ ...values, company: e.target.value })} />
        </div>
        <div>
          <label>Tags (comma separated)</label>
          <input value={values.tags} onChange={e => setValues({ ...values, tags: e.target.value })} />
        </div>
      </div>
      <div>
        <label>Notes</label>
        <textarea rows="3" value={values.notes} onChange={e => setValues({ ...values, notes: e.target.value })} />
      </div>

      <div className="actions">
        {onCancel && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
        <button type="submit">{initialValues ? 'Update' : 'Add Contact'}</button>
      </div>
    </form>
  )
}
