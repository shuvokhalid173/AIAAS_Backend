import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { createOrg } from '../api/org.api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import PageLayout from '../components/layout/PageLayout';
import './CreateOrgPage.css';

export default function CreateOrgPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', slug: '', description: '', website: '', logo_url: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({
      ...f,
      [key]: value,
      // Auto-generate slug from name
      ...(key === 'name' && !f.slug
        ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
        : {}),
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Organization name is required';
    if (!form.slug.trim()) e.slug = 'Slug is required';
    else if (!/^[a-z0-9-]+$/.test(form.slug)) e.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    if (form.website && !/^https?:\/\/.+/.test(form.website)) e.website = 'Enter a valid URL (http:// or https://)';
    if (form.logo_url && !/^https?:\/\/.+/.test(form.logo_url)) e.logo_url = 'Enter a valid URL';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        ...(form.description && { description: form.description }),
        ...(form.website && { website: form.website }),
        ...(form.logo_url && { logo_url: form.logo_url }),
      };
      await createOrg(payload);
      addToast(`Organization "${form.name}" created! 🎉`, 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || err.response?.data?.error || 'Failed to create organization.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="container create-org">
        <div className="create-org__card animate-fade-in-up">
          {/* Header */}
          <div className="create-org__header">
            <div className="create-org__icon" aria-hidden="true">🏢</div>
            <h1 className="create-org__title">Create Organization</h1>
            <p className="create-org__subtitle">
              Set up your organization to start using AIaaS services.
            </p>
          </div>

          <form className="create-org__form" onSubmit={handleSubmit} noValidate>
            {/* Basic info */}
            <section className="create-org__section">
              <h2 className="create-org__section-title">Basic information</h2>
              <Input
                id="org-name"
                label="Organization name"
                type="text"
                value={form.name}
                error={errors.name}
                required
                onChange={set('name')}
              />
              <Input
                id="org-slug"
                label="Slug (URL identifier)"
                type="text"
                value={form.slug}
                error={errors.slug}
                hint="Used in URLs. Lowercase letters, numbers, hyphens only."
                required
                onChange={set('slug')}
              />
              <Input
                id="org-description"
                label="Description (optional)"
                type="text"
                value={form.description}
                error={errors.description}
                onChange={set('description')}
              />
            </section>

            {/* Online presence */}
            <section className="create-org__section">
              <h2 className="create-org__section-title">Online presence</h2>
              <Input
                id="org-website"
                label="Website URL (optional)"
                type="url"
                value={form.website}
                error={errors.website}
                hint="e.g. https://yourcompany.com"
                onChange={set('website')}
              />
              <Input
                id="org-logo"
                label="Logo URL (optional)"
                type="url"
                value={form.logo_url}
                error={errors.logo_url}
                hint="e.g. https://yourcompany.com/logo.png"
                onChange={set('logo_url')}
              />
            </section>

            {/* Actions */}
            <div className="create-org__actions">
              <Button type="submit" variant="primary" size="lg" loading={loading} id="create-org-submit">
                Create organization
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}
