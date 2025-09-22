import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/home.css";

const slides = [
  {
    title: "Realtime Workforce Insights",
    description:
      "Visualize attendance and productivity stats with live dashboards tailored for estate supervisors.",
    accent: "#38bdf8",
    accentSecondary: "#1e3a8a",
  },
  {
    title: "Simple Task Dispatch",
    description:
      "Assign tapping routes and follow completion progress without stepping out of the office.",
    accent: "#f97316",
    accentSecondary: "#c2410c",
  },
  {
    title: "Warehouse At A Glance",
    description:
      "Track raw latex stock levels and automate reorder reminders before shortages occur.",
    accent: "#34d399",
    accentSecondary: "#047857",
  },
];

function Home() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const showPrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const showNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <div className="home">
      <div className="home__frame">
        <header className="home__header">
          <div className="home__brand">
            <span className="home__logo">Rubber Factory</span>
            <span className="home__tagline">Smart estate operations at a glance</span>
          </div>
          <button className="home__login-button" onClick={handleLogin} type="button">
            Login
          </button>
        </header>

        <main className="home__main" role="main">
          <section className="home__hero">
            <h1>Streamline your day-to-day estate management</h1>
            <p>
              Monitor workforce activity, assign tasks, manage inventory, and resolve queries from a single
              platform designed for the plantation team.
            </p>
            <div className="home__actions">
              <button className="home__cta" onClick={handleLogin} type="button">
                Get Started
              </button>
            </div>
          </section>

          <section className="home__slideshow" aria-label="Product highlights">
            <div className="home__slides" role="list" aria-live="polite">
              {slides.map((slide, index) => (
                <article
                  key={slide.title}
                  className={`home__slide ${index === activeIndex ? "home__slide--active" : ""}`}
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${slide.accent}, ${slide.accentSecondary})`,
                  }}
                  aria-hidden={index !== activeIndex}
                  role="listitem"
                >
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                </article>
              ))}
            </div>

            <div className="home__controls">
              <button
                type="button"
                className="home__control home__control--prev"
                onClick={showPrevious}
                aria-label="Show previous highlight"
              >
                Prev
              </button>
              <div className="home__dots" role="tablist" aria-label="Highlight navigation">
                {slides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    className={`home__dot ${index === activeIndex ? "home__dot--active" : ""}`}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show highlight ${index + 1}`}
                    aria-selected={index === activeIndex}
                    role="tab"
                  />
                ))}
              </div>
              <button
                type="button"
                className="home__control home__control--next"
                onClick={showNext}
                aria-label="Show next highlight"
              >
                Next
              </button>
            </div>
          </section>
        </main>
      </div>

      <footer className="home__footer">
        <div className="home__footer-inner">
          <div className="home__footer-top">
            <div>
              <h4>Rubber Factory Platform</h4>
              <p>Digital tools built for plantation directors, field supervisors, and support teams.</p>
            </div>
            <div className="home__footer-links">
              <button type="button" className="home__footer-link" onClick={handleLogin}>
                Dashboard Login
              </button>
              <button type="button" className="home__footer-link">
                Knowledge Base
              </button>
              <button type="button" className="home__footer-link">
                Support
              </button>
            </div>
          </div>
          <div className="home__footer-bottom">
            <span>&copy; {new Date().getFullYear()} Rubber Factory. All rights reserved.</span>
            <span>Crafted in Sri Lanka for estate excellence.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
