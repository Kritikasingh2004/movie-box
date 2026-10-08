import { useEffect, useState } from "react";
import "./style/App.css";
import { useDebounce } from "react-use";

const API_BASE_URL: string = "https://api.themoviedb.org/3";

const READ_TOKEN: string = import.meta.env.VITE_MOVIE_DB_READ_TOKEN;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${READ_TOKEN}`,
  },
};

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);

  // Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (searchTerm: string) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = searchTerm
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(searchTerm)}`
        : `${API_BASE_URL}/discover/movie/sort_by=popularity.desc`;

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
      console.log("Fetched movies:", data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // const loadTrendingMovies = async () => {
  //   try {
  //     const movies = await getTrendingMovies();

  //     setTrendingMovies(movies);
  //   } catch (error) {
  //     console.error("Error loading trending movies:", error);
  //     setErrorMessage("Error loading trending movies. Please try again later.");
  //   }
  // };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // useEffect(() => {
  //   loadTrendingMovies();
  // }, []);

  return <></>;
};

export default App;
