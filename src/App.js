import React, { useState, useEffect } from "react";
import "./App.css";

const API_KEY = "c6c67d90";

function App() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (search.trim() === "") return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`
      );
      const data = await response.json();
      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setError(data.Error || "No results found");
        setMovies([]);
      }
    } catch {
      setError("Failed to fetch movies.");
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendedMovies = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=Avengers`
      );
      const data = await response.json();
      if (data.Response === "True") {
        setRecommended(data.Search);
      } else {
        setError("No recommended movies found.");
      }
    } catch {
      setError("Failed to load recommended movies.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (movie) => {
    const isFavorited = favorites.some((fav) => fav.imdbID === movie.imdbID);
    const updatedFavorites = isFavorited
      ? favorites.filter((fav) => fav.imdbID !== movie.imdbID)
      : [...favorites, movie];
    setFavorites(updatedFavorites);
  };

  useEffect(() => {
    loadRecommendedMovies();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <div className="app">
      <h1>🎬 Movie Search App</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {movies.length > 0 && (
        <>
          <h2>Search Results</h2>
          <div className="movie-list">
            {movies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                isFavorited={favorites.some((fav) => fav.imdbID === movie.imdbID)}
                toggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </>
      )}

      <div className="movies">
        <h2>Recommended Movies</h2>
        <div className="movie-list">
          {recommended.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              isFavorited={favorites.some((fav) => fav.imdbID === movie.imdbID)}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        <h2>Favorite Movies</h2>
        <div className="movie-list">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              isFavorited={true}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MovieCard({ movie, isFavorited, toggleFavorite }) {
  return (
    <div className="movie-card">
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"}
        alt={movie.Title}
      />
      <h3>{movie.Title}</h3>
      <p>{movie.Year}</p>
      <button onClick={() => toggleFavorite(movie)}>
        {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
      </button>
    </div>
  );
}

export default App;
