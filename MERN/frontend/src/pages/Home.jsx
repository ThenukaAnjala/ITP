import { useNavigate } from "react-router-dom";
import "../styles/pages/home.css";

function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="home">
      <header className="home__header">
        <div className="home__brand">
          <span className="home__logo">Rubber Factory</span>
          <span className="home__tagline">Smart estate operations at a glance</span>
        </div>
        <button className="home__login-button" onClick={handleLogin}>
          Login
        </button>
      </header>

      <main className="home__content">
        <h1>Streamline your day-to-day estate management</h1>
        <p>
          Monitor workforce activity, assign tasks, manage inventory, and resolve queries from a single platform designed for the plantation team.
        </p>
        <div className="home__actions">
          <button className="home__cta" onClick={handleLogin}>
            Get Started
          </button>
        </div>
      </main>
    </div>
  );
}

export default Home;
