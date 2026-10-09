import type { Models } from "appwrite";

export interface TrendingMovie extends Models.Row {
  searchTerm: string;
  count: number;
  movie_id: number;
  poster_path: string;
}

export interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string | null;
  release_date: string;
  original_language: string;
  overview: string;
  backdrop_path: string | null;
  genre_ids: number[];
}
