import PageLayout from "../components/layout/PageLayout";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import './InstallationPage.css';
import { useAuth } from "../context/AuthContext";

export default function InstallationPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    return (
        <PageLayout>
            {
                user?.oid ? (
                    <div className="container installation-page">
                        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="installation-page__back">
                            ← Back
                        </Button>
                        <article className="installation-page__card">
                            <div className="installation-page__header">
                                <h1 className="installation-page__title">Installation</h1>
                            </div>
                            <div className="installation-page__body">
                                {/* two way of installing chatbot. 1. copy and paste code 2. adding js script tag */}
                                <div className="installation-page__installation-methods">
                                    <div className="installation-page__installation-method">
                                        <h2>Adding JS Script Tag</h2>
                                        <p>Add the following script tag to your HTML file.</p>
                                        <pre><code>{`<script src="http://localhost:3000/chatbot-client.js"></script>`}</code></pre>
                                    </div>
                                </div>
                            </div>
                            <div className="installation-page__footer">
                                <Button variant="primary" size="lg" onClick={() => navigate('/')}>
                                    View all services
                                </Button>
                            </div>
                        </article>
                    </div>
                ) : (
                    <div className="container installation-page">
                        <p>Please switch to an organization before getting any services.</p>
                        <br></br>
                        <Button variant="primary" size="lg" onClick={() => navigate('/dashboard')}>
                            Go to dashboard
                        </Button>
                    </div>
                )
            }
        </PageLayout>
    );
}