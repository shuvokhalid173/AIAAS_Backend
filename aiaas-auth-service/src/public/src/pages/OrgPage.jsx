import PageLayout from "../components/layout/PageLayout";
import { useAuth } from "../context/AuthContext";
import OrgPageSidebar from "../components/org/OrgPageSidebar";
import OrgPageContent from "../components/org/OrgPageContent";

export default function OrgPage() {
  const { activeOrg } = useAuth();
  return (
    <PageLayout>
      <div className="container">
        <OrgPageSidebar />
        <OrgPageContent />
      </div>
    </PageLayout>
  );
}