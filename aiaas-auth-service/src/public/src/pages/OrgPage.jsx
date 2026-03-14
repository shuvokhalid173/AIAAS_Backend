import PageLayout from "../components/layout/PageLayout";
import { useAuth } from "../context/AuthContext";
import OrgPageSidebar from "../components/org/OrgPageSidebar";
import OrgPageContent from "../components/org/OrgPageContent";
import { useState } from "react";
import "./OrgPage.css";

export default function OrgPage() {
  const { activeOrg } = useAuth();
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <PageLayout>
      <div className="container org-page-container">
        <OrgPageSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <OrgPageContent activeTab={activeTab} orgId={activeOrg?.id} />
      </div>
    </PageLayout>
  );
}