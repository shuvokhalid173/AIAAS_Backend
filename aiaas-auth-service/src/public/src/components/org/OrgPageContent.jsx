import './OrgPageContent.css';

export default function OrgPageContent({ activeTab }) {
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="org-page-content__section animate-fade-in-up">
            <h2>Dashboard</h2>
            <p className="org-page-content__desc">Overview of your organization's statistics and recent activities.</p>
            <div className="org-page-content__placeholder glass">
              <span className="gradient-text">Dashboard Widgets Coming Soon</span>
            </div>
          </div>
        );
      case "Settings":
        return (
          <div className="org-page-content__section animate-fade-in-up">
            <h2>Organization Settings</h2>
            <p className="org-page-content__desc">Manage your organization's general preferences and information.</p>
          </div>
        );
      case "Members":
        return (
          <div className="org-page-content__section animate-fade-in-up">
            <h2>Team Members</h2>
            <p className="org-page-content__desc">Manage who has access to this organization and their roles.</p>
            <div className="org-page-content__placeholder glass">
              Members list and invite form will be here.
            </div>
          </div>
        );
      case "Billing":
        return (
          <div className="org-page-content__section animate-fade-in-up">
            <h2>Billing & Subscriptions</h2>
            <p className="org-page-content__desc">Manage your AIaaS platform billing details and active plans.</p>
          </div>
        );
      case "API Keys":
        return (
          <div className="org-page-content__section animate-fade-in-up">
            <h2>API Keys</h2>
            <p className="org-page-content__desc">Generate and manage API keys to authenticate your requests.</p>
          </div>
        );
      case "Webhooks":
        return (
          <div className="org-page-content__section animate-fade-in-up">
            <h2>Webhooks</h2>
            <p className="org-page-content__desc">Configure endpoints to receive real-time events from our platform.</p>
          </div>
        );
      case "Integrations":
        return (
          <div className="org-page-content__section animate-fade-in-up">
            <h2>Integrations</h2>
            <p className="org-page-content__desc">Connect your organization with third-party tools and services.</p>
          </div>
        );
      case "Danger Zone":
        return (
          <div className="org-page-content__section animate-fade-in-up">
            <h2 style={{ color: "var(--color-error)" }}>Danger Zone</h2>
            <p className="org-page-content__desc">Destructive actions like deleting the organization.</p>
            <div className="org-page-content__placeholder glass border-error">
              <button className="org-page-content__btn-danger">Delete Organization</button>
            </div>
          </div>
        );
      default:
        return (
          <div className="org-page-content__section animate-fade-in-up">
            <h2>{activeTab}</h2>
            <p className="org-page-content__desc">Content for {activeTab} goes here.</p>
          </div>
        );
    }
  };

  return (
    <div className="org-page-content glass">
      {renderContent()}
    </div>
  );
}