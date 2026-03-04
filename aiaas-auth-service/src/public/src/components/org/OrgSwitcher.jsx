import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { switchOrg } from '../../api/org.api';
import './OrgSwitcher.css';

export default function OrgSwitcher({ orgs = [], currentOrgId, onSwitch }) {
  const [switchingId, setSwitchingId] = useState(null);
  const { storeTokens } = useAuth();
  const { addToast } = useToast();

  const handleSwitch = async (org) => {
    if (org.id === currentOrgId || switchingId) return;
    setSwitchingId(org.id);
    try {
      const { data } = await switchOrg(org.id);
      if (data.token) storeTokens(data.token);
      addToast(`Switched to "${org.name}"`, 'success');
      onSwitch?.(org);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to switch org', 'error');
    } finally {
      setSwitchingId(null);
    }
  };

  if (!orgs.length) return null;

  return (
    <div className="org-switcher-grid">
      {orgs.map((org) => {
        const isActive = org.id === currentOrgId;
        const isSwitching = switchingId === org.id;

        return (
          <button
            key={org.id}
            className={`org-switcher-card ${isActive ? 'active' : ''}`}
            onClick={() => handleSwitch(org)}
            disabled={!!switchingId && !isActive}
            aria-label={`Switch to ${org.name}`}
          >
            <div className="org-switcher-card__avatar">
              {org.name?.[0]?.toUpperCase() || 'O'}
            </div>
            <div className="org-switcher-card__info">
              <span className="org-switcher-card__name">
                {isSwitching ? 'Switching…' : org.name}
              </span>
              {org.slug && <span className="org-switcher-card__slug">/{org.slug}</span>}
            </div>
            {isActive && (
              <div className="org-switcher-card__check">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
