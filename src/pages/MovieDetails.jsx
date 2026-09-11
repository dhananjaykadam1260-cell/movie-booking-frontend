import { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

import api from "../services/api";
import "./MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMovie();
  }, [id]);

  const loadMovie = async () => {
    try {
      setLoading(true);
      setError("");

      const [movieRes, showsRes] =
        await Promise.all([
          api.get(`/movies/${id}`),
          api.get(`/shows/movie/${id}`)
        ]);

      setMovie(movieRes.data);

      const currentTime = new Date();

      const availableShows =
        (showsRes.data || [])
          .filter((show) => {
            const showDateTime =
              new Date(
                `${show.showDate}T${show.showTime}`
              );

            return showDateTime > currentTime;
          })
          .sort((a, b) => {
            const first =
              new Date(
                `${a.showDate}T${a.showTime}`
              );

            const second =
              new Date(
                `${b.showDate}T${b.showTime}`
              );

            return first - second;
          });

      setShows(availableShows);

    } catch (error) {
      console.error(
        "Movie loading error:",
        error
      );

      setError(
        "Unable to load movie details. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  const groupedShows = useMemo(() => {
    const groups = {};

    shows.forEach((show) => {
      if (!groups[show.showDate]) {
        groups[show.showDate] = [];
      }

      groups[show.showDate].push(show);
    });

    return groups;
  }, [shows]);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] =
      time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0
    );

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }
    );
  };

  const bookShow = (showId) => {
    navigate(`/seats/${showId}`);
  };

  if (loading) {
    return (
      <div className="movie-details-loading">

        <div
          className="spinner-border text-danger"
          role="status"
        />

        <p>
          Loading movie details...
        </p>

      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-details-state">

        <h3>
          Something went wrong
        </h3>

        <p>{error}</p>

        <button onClick={loadMovie}>
          Try Again
        </button>

      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details-state">

        <h3>
          Movie not found
        </h3>

        <button
          onClick={() =>
            navigate("/")
          }
        >
          Back to Movies
        </button>

      </div>
    );
  }

  return (
    <div className="movie-details-page">

      {/* HERO */}

      <section
        className="movie-details-hero"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(10,10,12,0.98) 15%,
              rgba(10,10,12,0.88) 50%,
              rgba(10,10,12,0.62) 100%
            ),
            url("${movie.imageUrl}")
          `
        }}
      >

        <div className="container">

          <button
            className="movie-back-btn"
            onClick={() =>
              navigate("/")
            }
          >
            ← Back to Movies
          </button>

          <div className="movie-hero-grid">

            {/* POSTER */}

            <div className="details-poster">

              <img
                src={movie.imageUrl}
                alt={movie.title}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/500x750/202020/ffffff?text=Movie";
                }}
              />

            </div>

            {/* INFO */}

            <div className="details-info">

              <span className="details-label">
                NOW SHOWING
              </span>

              <h1>
                {movie.title}
              </h1>

              <div className="details-tags">

                <span>
                  {movie.language}
                </span>

                <span>
                  {movie.genre}
                </span>

                <span>
                  {movie.duration} min
                </span>

              </div>

              <p className="movie-description">
                {movie.description}
              </p>

              <div className="details-actions">

                <button
                  className="primary-book-btn"
                  disabled={
                    shows.length === 0
                  }
                  onClick={() => {
                    document
                      .getElementById(
                        "available-shows"
                      )
                      ?.scrollIntoView({
                        behavior: "smooth"
                      });
                  }}
                >
                  {shows.length > 0
                    ? "Book Tickets"
                    : "No Shows Available"}
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* SHOWS */}

      <section
        id="available-shows"
        className="available-shows-section"
      >

        <div className="container">

          <div className="shows-heading">

            <div>

              <span>
                SHOWTIMES
              </span>

              <h2>
                Available Shows
              </h2>

              <p>
                Select a theatre, date and showtime
                to continue.
              </p>

            </div>

            <div className="shows-count">
              {shows.length}{" "}
              {shows.length === 1
                ? "Show"
                : "Shows"}
            </div>

          </div>

          {shows.length === 0 ? (

            <div className="no-shows">

              <div className="no-shows-icon">
                🎬
              </div>

              <h3>
                No upcoming shows
              </h3>

              <p>
                There are currently no upcoming
                shows available for this movie.
              </p>

              <button
                onClick={() =>
                  navigate("/")
                }
              >
                Browse Other Movies
              </button>

            </div>

          ) : (

            <div className="show-date-groups">

              {Object.entries(
                groupedShows
              ).map(
                ([date, dateShows]) => (

                  <div
                    className="show-date-group"
                    key={date}
                  >

                    <div className="show-date-heading">

                      <span>
                        {formatDate(date)}
                      </span>

                    </div>

                    <div className="theatre-show-list">

                      {dateShows.map(
                        (show) => (

                          <div
                            className="show-card"
                            key={show.id}
                          >

                            <div className="show-theatre">

                              <h4>
                                {show.theatre
                                  ?.name ||
                                  "Theatre"}
                              </h4>

                              <p>
                                {show.theatre
                                  ?.city ||
                                  ""}
                              </p>

                              {show.theatre
                                ?.address && (
                                <small>
                                  {
                                    show.theatre
                                      .address
                                  }
                                </small>
                              )}

                            </div>

                            <div className="show-details">

                              <div className="show-detail">

                                <span>
                                  Screen
                                </span>

                                <strong>
                                  {show.screen
                                    ?.screenName ||
                                    "N/A"}
                                </strong>

                              </div>

                              <div className="show-detail">

                                <span>
                                  Time
                                </span>

                                <strong>
                                  {formatTime(
                                    show.showTime
                                  )}
                                </strong>

                              </div>

                              <div className="show-detail">

                                <span>
                                  Price
                                </span>

                                <strong className="show-price">
                                  ₹
                                  {
                                    show.ticketPrice
                                  }
                                </strong>

                              </div>

                            </div>

                            <button
                              className="select-show-btn"
                              onClick={() =>
                                bookShow(
                                  show.id
                                )
                              }
                            >
                              Select Seats
                            </button>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default MovieDetails;