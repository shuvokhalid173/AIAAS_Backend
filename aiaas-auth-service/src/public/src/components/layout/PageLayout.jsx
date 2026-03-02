import Navbar from './Navbar';
import './PageLayout.css';

export default function PageLayout({ children }) {
  return (
    <div className="page-layout">
      <Navbar />
      <main className="page-layout__main">{children}</main>
      <footer className="page-layout__footer">
        <div className="container">
          <p className="page-layout__footer-text">
            © {new Date().getFullYear()} AIaaS Platform. Built for the future of AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
