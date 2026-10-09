import { useEffect, useState } from "react";
import "./style/App.css";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import type { Movie, TrendingMovie } from "./types/movies";
import { updateSearchCount, getTrendingMovies } from "./lib/appwrite";

const API_BASE_URL: string = "https://api.themoviedb.org/3";

const READ_TOKEN: string = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${READ_TOKEN}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);

  const fetchMovies = async (searchTerm: string) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = searchTerm
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(searchTerm)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch movies: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        return;
      }

      setMovieList(data.results || []);

      if (searchTerm && data.results.length > 0) {
        await updateSearchCount(searchTerm, data.results[0]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies: TrendingMovie[] = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error("Error loading trending movies:", error);
      setErrorMessage("Error loading trending movies. Please try again later.");
    }
  };

  useDebounce(
    () => {
      fetchMovies(searchTerm);
    },
    500,
    [searchTerm],
  );

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Hero Banner" />
            <h1>
              Find <span className="tex-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>

              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_path || ""} alt={movie.title} />
                  </li>
                ))}
                ;
              </ul>
            </section>
          )}

          <section className="all-movies">
            <h2>All Movies</h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="test-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};
export default App;
