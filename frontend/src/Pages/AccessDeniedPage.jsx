import { Link } from "react-router-dom";
import "../style/AccessDeniedPage.css";

export default function AccessDeniedPage() {
  return (
    <div className="access-page">
      <div className="access-card">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
          alt="Access Denied"
        />

        <h1>Access Denied</h1>

        

        <div className="access-buttons">
          

          <Link to="/" className="home-btn">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}