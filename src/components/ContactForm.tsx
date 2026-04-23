import { useState } from 'react';
import './ContactForm.css';

export interface Unit {
  slug: string;
  name: string;
}

export interface ContactFormLabels {
  name: string;
  email: string;
  phone: string;
  unit: string;
  unitPlaceholder: string;
  checkin: string;
  checkout: string;
  guests: string;
  message: string;
  messagePlaceholder: string;
  gdpr: string;
  gdprLink: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
}

interface Props {
  accessKey: string;
  units: Unit[];
  defaultUnit?: string;
  defaultFrom?: string;
  defaultTo?: string;
  defaultGuests?: string;
  privacyHref: string;
  contactEmail: string;
  labels: ContactFormLabels;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm({
  accessKey,
  units,
  defaultUnit = '',
  defaultFrom = '',
  defaultTo = '',
  defaultGuests = '',
  privacyHref,
  contactEmail,
  labels,
}: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [unit, setUnit] = useState(defaultUnit);
  const [checkin, setCheckin] = useState(defaultFrom);
  const [checkout, setCheckout] = useState(defaultTo);
  const [guests, setGuests] = useState(defaultGuests);
  const [message, setMessage] = useState('');
  const [gdpr, setGdpr] = useState(false);
  const [status, setStatus] = useState<Status>('idle');

  // Track which required fields have been touched (for inline validation)
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const requiredEmpty = !name.trim() || !email.trim() || !message.trim() || !gdpr;

  const unitLabel = units.find((u) => u.slug === unit)?.name ?? unit;
  const subject = `[Richiesta Giada Palace] ${checkin || '—'} — ${checkout || '—'} — ${unitLabel || '—'}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true, gdpr: true });
    if (requiredEmpty) return;

    setStatus('submitting');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject,
          from_name: name,
          replyto: email,
          name,
          email,
          phone: phone || undefined,
          unit: unitLabel || undefined,
          checkin: checkin || undefined,
          checkout: checkout || undefined,
          guests: guests || undefined,
          message,
          botcheck: '',
        }),
      });
      const data = await res.json();
      setStatus(data.success ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="cf-success" role="alert">
        <svg className="cf-success-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="cf-success-text">{labels.success}</p>
      </div>
    );
  }

  return (
    <form className="cf-form" onSubmit={handleSubmit} noValidate>
      {/* Honeypot */}
      <input type="checkbox" name="botcheck" className="cf-honeypot" tabIndex={-1} aria-hidden="true" />

      {status === 'error' && (
        <div className="cf-error-banner" role="alert">
          <svg className="cf-error-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="cf-error-text">
            {labels.error}{' '}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
          </p>
        </div>
      )}

      {/* Name + Email */}
      <div className="cf-row">
        <div className="cf-field">
          <label className="cf-label" htmlFor="cf-name">{labels.name} *</label>
          <input
            id="cf-name"
            type="text"
            className="cf-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            aria-invalid={touched.name && !name.trim() ? 'true' : undefined}
            required
            autoComplete="name"
          />
        </div>
        <div className="cf-field">
          <label className="cf-label" htmlFor="cf-email">{labels.email} *</label>
          <input
            id="cf-email"
            type="email"
            className="cf-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            aria-invalid={touched.email && !email.trim() ? 'true' : undefined}
            required
            autoComplete="email"
          />
        </div>
      </div>

      {/* Phone + Unit */}
      <div className="cf-row">
        <div className="cf-field">
          <label className="cf-label" htmlFor="cf-phone">{labels.phone}</label>
          <input
            id="cf-phone"
            type="tel"
            className="cf-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </div>
        <div className="cf-field">
          <label className="cf-label" htmlFor="cf-unit">{labels.unit}</label>
          <select
            id="cf-unit"
            className="cf-select"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="">{labels.unitPlaceholder}</option>
            {units.map((u) => (
              <option key={u.slug} value={u.slug}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Check-in + Check-out */}
      <div className="cf-row">
        <div className="cf-field">
          <label className="cf-label" htmlFor="cf-checkin">{labels.checkin}</label>
          <input
            id="cf-checkin"
            type="date"
            className="cf-input"
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
          />
        </div>
        <div className="cf-field">
          <label className="cf-label" htmlFor="cf-checkout">{labels.checkout}</label>
          <input
            id="cf-checkout"
            type="date"
            className="cf-input"
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
          />
        </div>
      </div>

      {/* Guests */}
      <div className="cf-field" style={{ maxWidth: '200px' }}>
        <label className="cf-label" htmlFor="cf-guests">{labels.guests}</label>
        <input
          id="cf-guests"
          type="number"
          className="cf-input"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          min="1"
          max="20"
        />
      </div>

      {/* Message */}
      <div className="cf-field">
        <label className="cf-label" htmlFor="cf-message">{labels.message} *</label>
        <textarea
          id="cf-message"
          className="cf-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, message: true }))}
          aria-invalid={touched.message && !message.trim() ? 'true' : undefined}
          placeholder={labels.messagePlaceholder}
          required
        />
      </div>

      {/* GDPR */}
      <div className="cf-gdpr">
        <input
          id="cf-gdpr"
          type="checkbox"
          className="cf-gdpr-checkbox"
          checked={gdpr}
          onChange={(e) => setGdpr(e.target.checked)}
          required
        />
        <label htmlFor="cf-gdpr" className="cf-gdpr-label">
          {labels.gdpr}{' '}
          <a href={privacyHref} target="_blank" rel="noopener noreferrer">
            {labels.gdprLink}
          </a>
          . *
        </label>
      </div>

      <button
        type="submit"
        className="cf-submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}
