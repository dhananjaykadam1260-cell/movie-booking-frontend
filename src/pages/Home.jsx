import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [language, setLanguage] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/movies");

      setMovies(response.data || []);
    } catch (error) {
      console.error("Error loading movies:", error);

      setError(
        "Unable to load movies. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const genres = useMemo(() => {
    return [
      "All",
      ...new Set(
        movies
          .map((movie) => movie.genre)
          .filter(Boolean)
      )
    ];
  }, [movies]);

  const languages = useMemo(() => {
    return [
      "All",
      ...new Set(
        movies
          .map((movie) => movie.language)
          .filter(Boolean)
      )
    ];
  }, [movies]);

  const filteredMovies = movies.filter((movie) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      movie.title?.toLowerCase().includes(searchText) ||
      movie.genre?.toLowerCase().includes(searchText) ||
      movie.language?.toLowerCase().includes(searchText);

    const matchesGenre =
      genre === "All" || movie.genre === genre;

    const matchesLanguage =
      language === "All" ||
      movie.language === language;

    return (
      matchesSearch &&
      matchesGenre &&
      matchesLanguage
    );
  });

  const featuredMovie = movies[0];

  return (
    <div className="home-page">

      {/* HERO */}
      <section
        className="home-hero"
        style={{
          backgroundImage: featuredMovie?.imageUrl
            ? `linear-gradient(
                90deg,
                rgba(8, 8, 10, 0.98) 15%,
                rgba(8, 8, 10, 0.85) 48%,
                rgba(8, 8, 10, 0.55) 100%
              ),
              url("${featuredMovie.imageUrl}")`
            : undefined
        }}
      >
        <div className="container hero-content">

          <span className="hero-badge">
            NOW SHOWING
          </span>

          <h1>
            {featuredMovie?.title ||
              "Your movies. Your seats. Your experience."}
          </h1>

          <p className="hero-description">
            {featuredMovie?.description ||
              "Discover movies, choose your favourite show and book your seats in just a few clicks."}
          </p>

          {featuredMovie && (
            <>
              <div className="hero-details">
                <span>
                  {featuredMovie.genre}
                </span>

                <span>
                  {featuredMovie.language}
                </span>

                <span>
                  {featuredMovie.duration} min
                </span>
              </div>

              <button
                className="hero-book-btn"
                onClick={() =>
                  navigate(
                    `/movie/${featuredMovie.id}`
                  )
                }
              >
                Book Tickets
              </button>
            </>
          )}

        </div>
      </section>

      {/* SEARCH AREA */}
      <section className="search-wrapper">

        <div className="container">

          <div className="movie-search-panel">

            <div className="search-box">

              <span className="search-icon">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search for movies, genres or languages..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <select
              value={genre}
              onChange={(e) =>
                setGenre(e.target.value)
              }
            >
              {genres.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item === "All"
                    ? "All Genres"
                    : item}
                </option>
              ))}
            </select>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
            >
              {languages.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item === "All"
                    ? "All Languages"
                    : item}
                </option>
              ))}
            </select>

          </div>

        </div>

      </section>

      {/* MOVIES */}
      <section className="container movies-section">

        <div className="movies-heading">

          <div>
            <span className="section-small-title">
              EXPLORE
            </span>

            <h2>
              Recommended Movies
            </h2>

            <p>
              Choose a movie and find your perfect show.
            </p>
          </div>

          {!loading && (
            <span className="movie-count">
              {filteredMovies.length}{" "}
              {filteredMovies.length === 1
                ? "Movie"
                : "Movies"}
            </span>
          )}

        </div>

        {loading && (
          <div className="home-message">

            <div
              className="spinner-border text-danger"
              role="status"
            />

            <p>Loading movies...</p>

          </div>
        )}

        {error && !loading && (
          <div className="home-message">

            <h4>Something went wrong</h4>

            <p>{error}</p>

            <button
              className="retry-btn"
              onClick={loadMovies}
            >
              Try Again
            </button>

          </div>
        )}

        {!loading &&
          !error &&
          filteredMovies.length === 0 && (

            <div className="home-message">

              <div className="empty-icon">
                🎬
              </div>

              <h4>No movies found</h4>

              <p>
                Try changing your search or filters.
              </p>

              <button
                className="retry-btn"
                onClick={() => {
                  setSearch("");
                  setGenre("All");
                  setLanguage("All");
                }}
              >
                Clear Filters
              </button>

            </div>

          )}

        {!loading &&
          !error &&
          filteredMovies.length > 0 && (

            <div className="row g-4">

              {filteredMovies.map(
                (movie) => (

                  <div
                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                    key={movie.id}
                  >

                    <article className="movie-card">

                      <div
                        className="movie-poster-wrapper"
                        onClick={() =>
                          navigate(
                            `/movie/${movie.id}`
                          )
                        }
                      >

                        <img
                          src={movie.imageUrl}
                          alt={movie.title}
                          className="movie-poster-image"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/500x750/202020/ffffff?text=Movie+Poster";
                          }}
                        />

                        <div className="poster-gradient" />

                        <span className="movie-language">
                          {movie.language}
                        </span>

                        <div className="poster-view">
                          View Details
                        </div>

                      </div>

                      <div className="movie-card-body">

                        <h5 title={movie.title}>
                          {movie.title}
                        </h5>

                        <div className="movie-card-details">

                          <span>
                            {movie.genre}
                          </span>

                          <span className="dot">
                            •
                          </span>

                          <span>
                            {movie.duration} min
                          </span>

                        </div>

                        <button
                          className="movie-book-btn"
                          onClick={() =>
                            navigate(
                              `/movie/${movie.id}`
                            )
                          }
                        >
                          Book Now
                        </button>

                      </div>

                    </article>

                  </div>

                )
              )}

            </div>

          )}

      </section>

      {/* BOTTOM BANNER */}
      <section className="booking-banner">

        <div className="container booking-banner-content">

          <div>
            <span>READY FOR MOVIE NIGHT?</span>

            <h2>
              Pick a movie. Choose your seats.
            </h2>

            <p>
              A simple and fast way to book
              your next movie.
            </p>
          </div>

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              })
            }
          >
            Browse Movies
          </button>

        </div>

      </section>

    </div>
  );
}

export default Home;