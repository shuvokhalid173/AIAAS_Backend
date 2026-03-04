import './OrgPageSidebar.css';

export default function OrgPageSidebar({ activeTab, setActiveTab }) {
  const sidebars = [
    { title: "Dashboard", id: "dashboard", icon: "📊", isActive: true },
    { title: "Settings", id: "settings", icon: "⚙️", isActive: true },
    { title: "Members", id: "members", icon: "👥", isActive: true },
    { title: "Billing", id: "billing", icon: "💳", isActive: false },
    { title: "API Keys", id: "api-keys", icon: "🔑", isActive: false },
    { title: "Webhooks", id: "webhooks", icon: "🪝", isActive: false },
    { title: "Integrations", id: "integrations", icon: "🧩", isActive: true },
    { title: "Danger Zone", id: "danger-zone", icon: "⚠️", isActive: true },
  ].filter((item) => item.isActive);
  return (
    <aside className="org-page-sidebar glass">
      <nav className="org-page-sidebar__nav">
        {sidebars.map((item) => (
          <button
            key={item.id}
            className={`org-page-sidebar__item ${activeTab === item.title ? "active" : ""}`}
            onClick={() => setActiveTab(item.title)}
          >
            <span className="org-page-sidebar__icon">{item.icon}</span>
            <span className="org-page-sidebar__text">{item.title}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}