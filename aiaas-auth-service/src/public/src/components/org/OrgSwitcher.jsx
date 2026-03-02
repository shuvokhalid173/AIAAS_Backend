import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { switchOrg } from '../../api/org.api';
import './OrgSwitcher.css';

export default function OrgSwitcher({ orgs = [], currentOrgId, onSwitch }) {
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const { storeTokens } = useAuth();
  const { addToast } = useToast();
  const ref = useRef(null);

  const currentOrg = orgs.find((o) => o.id === currentOrgId) || orgs[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSwitch = async (org) => {
    if (org.id === currentOrgId || switching) return;
    setOpen(false);
    setSwitching(true);
    try {
      const { data } = await switchOrg(org.id);
      if (data.token) storeTokens(data.token);
      addToast(`Switched to "${org.name}"`, 'success');
      onSwitch?.(org);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to switch org', 'error');
    } finally {
      setSwitching(false);
    }
  };

  if (!orgs.length) return null;

  return (
    <div className="org-switcher" ref={ref}>
      <button
        className={`org-switcher__trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen((s) => !s)}
        aria-label="Switch organization"
        aria-expanded={open}
        disabled={switching}
      >
        <div className="org-switcher__avatar">
          {currentOrg?.name?.[0]?.toUpperCase() || 'O'}
        </div>
        <div className="org-switcher__info">
          <span className="org-switcher__label">Organization</span>
          <span className="org-switcher__name">
            {switching ? 'Switching…' : (currentOrg?.name || 'Select Org')}
          </span>
        </div>
        <svg className="org-switcher__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div className="org-switcher__dropdown">
          <p className="org-switcher__dropdown-label">Your organizations</p>
          {orgs.map((org) => (
            <button
              key={org.id}
              className={`org-switcher__item ${org.id === currentOrgId ? 'active' : ''}`}
              onClick={() => handleSwitch(org)}
            >
              <div className="org-switcher__item-avatar">
                {org.name?.[0]?.toUpperCase() || 'O'}
              </div>
              <div className="org-switcher__item-info">
                <span className="org-switcher__item-name">{org.name}</span>
                {org.slug && <span className="org-switcher__item-slug">/{org.slug}</span>}
              </div>
              {org.id === currentOrgId && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
