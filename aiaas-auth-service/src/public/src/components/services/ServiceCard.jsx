import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import './ServiceCard.css';

export default function ServiceCard({ service }) {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch { return ''; }
  };

  return (
    <article className="service-card">
      <div className="service-card__header">
        <div className="service-card__icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        {service.created_at && (
          <span className="service-card__date">{formatDate(service.created_at)}</span>
        )}
      </div>

      <div className="service-card__body">
        <h3 className="service-card__name">{service.name || 'Unnamed Service'}</h3>
        <p className="service-card__description">
          {service.description || 'No description available.'}
        </p>
      </div>

      <div className="service-card__footer">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/services/${service.id}`)}
          id={`details-btn-${service.id}`}
        >
          Details
        </Button>
        {
          service.is_ready && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/services/${service.id}/installation`)}
              id={`get-btn-${service.id}`}
            >
              Get
            </Button>
          )
        }

        {
          !service.is_ready && (
            <Button
              variant="ghost"
              size="sm"
              disabled
              title="Coming soon"
              id={`get-btn-${service.id}`}
            >
              Get <span className="service-card__soon">Soon</span>
            </Button>)
        }
      </div>
    </article>
  );
}
