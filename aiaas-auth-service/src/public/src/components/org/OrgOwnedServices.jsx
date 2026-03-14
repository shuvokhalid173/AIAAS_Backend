import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrgServices } from '../../api/org.api';
import ServiceCard from '../services/ServiceCard';
import './OrgOwnedServices.css';

export default function OrgOwnedServices({ orgId }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orgId) return;

    setLoading(true);
    getOrgServices(orgId)
      .then(({ data }) => {
        setServices(data || []);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch services:', err);
        setError('Failed to load owned services.');
      })
      .finally(() => setLoading(false));
  }, [orgId]);

  if (loading) {
    return (
      <div className="org-owned-services__loading glass">
        <div className="org-owned-services__spinner"></div>
        <p>Loading your services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="org-owned-services__empty glass border-error">
        <div className="org-owned-services__empty-icon">❌</div>
        <h3>Oops!</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="org-owned-services">
      <div className="dashboard__section-header">
        <h2 className="dashboard__section-title">Owned Services</h2>
        <Link to="/#services" className="dashboard__section-link">
          Get a new service →
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="org-owned-services__empty glass">
          <div className="org-owned-services__empty-icon">🧩</div>
          <h3>No services yet</h3>
          <p>This organization doesn't have any active AIaaS services yet. Browse the marketplace to get started.</p>
          <Link to="/#services" className="dashboard__section-link">
            Browse services →
          </Link>
        </div>
      ) : (
        <div className="org-owned-services__grid">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
