import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getUserOrgs } from '../api/org.api';
import OrgSwitcher from '../components/org/OrgSwitcher';
import Button from '../components/ui/Button';
import PageLayout from '../components/layout/PageLayout';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [orgs, setOrgs] = useState([]);
  const [activeOrg, setActiveOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('auth', user);
    if (!user?.sub) { setLoading(false); return; }
    getUserOrgs(user.sub)
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : [];
        setOrgs(list);
        let activeOrg = null;
        for (let i = 0; i < list.length; i++) {
          if (list[i].id === user?.oid) {
            activeOrg = list[i];
            break;
          }
        }
        setActiveOrg(activeOrg);
      })
      .catch(() => addToast('Could not load organizations.', 'error'))
      .finally(() => setLoading(false));
  }, [user?.sub]);

  const handleOrgSwitch = (org) => {
    setActiveOrg(org);
    // reload the page to update navbar
    window.location.reload();
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // TODO: get user email should be fetched from auth service
  const emailName = user?.email?.split('@')[0] || 'there';

  return (
    <PageLayout>
      <div className="dashboard">
        {/* Header Banner */}
        <div className="dashboard__banner">
          <div className="dashboard__banner-glow" aria-hidden="true" />
          <div className="container dashboard__banner-inner">
            <div>
              <h1 className="dashboard__greeting">
                {greeting()}, <span className="gradient-text">{emailName}</span> 👋
              </h1>
              <p className="dashboard__sub">
                Manage your organizations and AI services from here.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/orgs/new')}
              id="create-org-btn"
            >
              + New Organization
            </Button>
          </div>
        </div>

        <div className="container dashboard__body">
          {/* Org block */}
          <div className="dashboard__section">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">Your Organizations</h2>
              <Link to="/orgs/new" className="dashboard__section-link">
                Create new →
              </Link>
            </div>

            {loading ? (
              <div className="dashboard__orgs-loading">
                <div className="dashboard__skeleton" />
                <div className="dashboard__skeleton" />
              </div>
            ) : orgs.length === 0 ? (
              <div className="dashboard__empty-orgs">
                <div className="dashboard__empty-icon" aria-hidden="true">🏢</div>
                <h3>No organizations yet</h3>
                <p>Create your first org to start using AIaaS services.</p>
                <Button variant="primary" onClick={() => navigate('/orgs/new')}>
                  Create organization
                </Button>
              </div>
            ) : (
              <div className="dashboard__orgs-layout">
                <OrgSwitcher
                  orgs={orgs}
                  currentOrgId={activeOrg?.id}
                  onSwitch={handleOrgSwitch}
                />

                {activeOrg && (
                  <div style={{cursor: 'pointer'}} onClick={() => navigate(`/orgs/${activeOrg.slug}`)} className="dashboard__active-org animate-fade-in">
                    <div className="dashboard__org-card">
                      <div className="dashboard__org-header">
                        <div className="dashboard__org-avatar">
                          {activeOrg.name?.[0]?.toUpperCase()}
                        </div>
                        <div> 
                          <h3 className="dashboard__org-name">{activeOrg.name}</h3>
                          {activeOrg.slug && (
                            <p className="dashboard__org-slug">/{activeOrg.slug}</p>
                          )}
                        </div>
                      </div>

                      {activeOrg.description && (
                        <p className="dashboard__org-desc">{activeOrg.description}</p>
                      )}

                      <div className="dashboard__org-meta">
                        {activeOrg.website && (
                          // when click on anchor tag, prevent parent div click event
                          <a
                            href={activeOrg.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dashboard__org-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            🌐 {activeOrg.website}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="dashboard__section">
            <h2 className="dashboard__section-title">Quick access</h2>
            <div className="dashboard__quick-grid">
              {[
                { icon: '🤖', title: 'AI Services', desc: 'Browse available AI services', href: '/' },
                { icon: '🏢', title: 'New Org', desc: 'Create a new organization', href: '/orgs/new' },
                { icon: '🔑', title: 'API Keys', desc: 'Manage your API credentials', href: '#', soon: true },
                { icon: '📊', title: 'Analytics', desc: 'Usage stats and insights', href: '#', soon: true },
              ].map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className={`dashboard__quick-card ${item.soon ? 'soon' : ''}`}
                  onClick={item.soon ? (e) => { e.preventDefault(); addToast('Coming soon!', 'info'); } : undefined}
                >
                  <span className="dashboard__quick-icon">{item.icon}</span>
                  <span className="dashboard__quick-title">{item.title}</span>
                  <span className="dashboard__quick-desc">{item.desc}</span>
                  {item.soon && <span className="tag" style={{ marginTop: 'auto' }}>Soon</span>}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
