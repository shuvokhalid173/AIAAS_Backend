import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import { getServiceById } from '../api/services.api';
import './ServiceDetailPage.css';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getServiceById(id)
      .then(({ data }) => setService(data))
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <PageLayout>
      <div className="container service-detail">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="service-detail__back">
          ← Back
        </Button>

        {loading && (
          <div className="service-detail__loading">
            <div className="service-detail__skeleton-hero" />
            <div className="service-detail__skeleton-body">
              <div className="skeleton-line skeleton-line--shorter" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
            </div>
          </div>
        )}

        {notFound && !loading && (
          <div className="service-detail__not-found animate-fade-in-up">
            <p className="service-detail__not-found-emoji">🔍</p>
            <h2>Service not found</h2>
            <p className="service-detail__not-found-text">
              This service may have been removed or the link is incorrect.
            </p>
            <Button variant="secondary" onClick={() => navigate('/')}>
              Back to Services
            </Button>
          </div>
        )}

        {service && !loading && (
          <article className="service-detail__card animate-fade-in-up">
            <div className="service-detail__hero">
              <div className="service-detail__icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <p className="tag">AI Service</p>
                <h1 className="service-detail__name">{service.name}</h1>
              </div>
            </div>

            <div className="service-detail__divider" />

            <div className="service-detail__meta">
              <div className="service-detail__meta-item">
                <span className="service-detail__meta-label">Service ID</span>
                <span className="service-detail__meta-value service-detail__mono">{service.id}</span>
              </div>
              <div className="service-detail__meta-item">
                <span className="service-detail__meta-label">Available since</span>
                <span className="service-detail__meta-value">{formatDate(service.created_at)}</span>
              </div>
            </div>

            <div className="service-detail__divider" />

            <div className="service-detail__description-block">
              <h2 className="service-detail__section-title">About this service</h2>
              <p className="service-detail__description">
                {service.description || 'No description provided for this service.'}
              </p>
            </div>

            <div className="service-detail__actions">
              {
                service.is_ready && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate(`/services/${service.id}/installation`)}
                  >
                    Get Service
                  </Button>
                )
              }
              {
                !service.is_ready && (
                  <Button
                    variant="primary"
                    size="lg"
                    disabled
                    title="Purchasing will be available soon"
                  >
                    Comming soon...
              </Button>
                )
              }
              <Button variant="ghost" size="lg" onClick={() => navigate('/')}>
                View all services
              </Button>
            </div>
          </article>
        )}
      </div>
    </PageLayout>
  );
}
