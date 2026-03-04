export default function OrgPageSidebar() {
  const sidebars = [
    { title: "Dashboard", href: "/orgs/:orgId" },
    { title: "Settings", href: "/orgs/:orgId/settings" },
    { title: "Members", href: "/orgs/:orgId/members" },
    { title: "Billing", href: "/orgs/:orgId/billing" },
    { title: "API Keys", href: "/orgs/:orgId/api-keys" },
    { title: "Webhooks", href: "/orgs/:orgId/webhooks" },
    { title: "Integrations", href: "/orgs/:orgId/integrations" },
    { title: "Danger Zone", href: "/orgs/:orgId/danger-zone" },
  ];
  return (
    <div className="org-page-sidebar">
      {sidebars.map((sidebar) => (
        <h1 key={sidebar.title}>{sidebar.title}</h1>
      ))}
    </div>
  );
}