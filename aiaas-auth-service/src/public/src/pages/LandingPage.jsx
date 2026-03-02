import { useEffect, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import ServiceCard from '../components/services/ServiceCard';
import { getAllServices } from '../api/services.api';
import './LandingPage.css';

export default function LandingPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllServices()
      .then(({ data }) => setServices(Array.isArray(data) ? data : []))
      .catch(() => setError('Failed to load services. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg-glow" aria-hidden="true" />
        <div className="container hero__content animate-fade-in-up">
          <div className="tag">🚀 AI as a Service Platform</div>
          <h1 className="hero__title">
            Power your business with
            <span className="gradient-text"> AI-driven</span> services
          </h1>
          <p className="hero__subtitle">
            Deploy intelligent chatbots, smart assistants, and AI-powered tools
            tailored to your organization's unique needs.
          </p>
          <div className="hero__cta">
            <a href="/register" className="btn btn--primary btn--lg">
              Start for free →
            </a>
            <a href="#services" className="btn btn--ghost btn--lg">
              Explore services
            </a>
          </div>

          {/* Stats strip */}
          <div className="hero__stats">
            {[
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '< 50ms', label: 'API latency' },
              { value: 'SOC 2', label: 'Compliant' },
              { value: '24/7', label: 'Support' },
            ].map((s) => (
              <div key={s.label} className="hero__stat">
                <span className="hero__stat-value">{s.value}</span>
                <span className="hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="services-section__header">
            <h2 className="services-section__title">Available AI Services</h2>
            <p className="services-section__subtitle">
              Browse our catalog of production-ready AI services.
            </p>
          </div>

          {loading && (
            <div className="services-section__loading">
              {[1, 2, 3].map((n) => (
                <div key={n} className="service-card-skeleton" aria-hidden="true">
                  <div className="skeleton-line skeleton-line--short" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line skeleton-line--shorter" />
                </div>
              ))}
            </div>
          )}

          {error && !loading && (
            <div className="services-section__error">
              <p>{error}</p>
              <button className="btn btn--secondary btn--sm" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="services-section__empty">
              <p className="services-section__empty-text">No services available yet.</p>
            </div>
          )}

          {!loading && !error && services.length > 0 && (
            <div className="services-grid">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
