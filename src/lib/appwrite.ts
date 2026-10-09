import { Client, Account, TablesDB, Query, ID } from "appwrite";
import type { Movie, TrendingMovie } from "../types/movies";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID);

const account = new Account(client);
const tablesDB = new TablesDB(client);

const updateSearchCount = async (
  searchTerm: string,
  movie: Movie,
): Promise<void> => {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.equal("searchTerm", searchTerm)],
    });

    if (result.rows.length > 0) {
      const row = result.rows[0];

      await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: row.$id,
        data: {
          count: row.count + 1,
        },
      });
    } else {
      await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: {
          searchTerm,
          movie_id: movie.id,
          poster_path: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "",
        },
      });
    }
  } catch (error) {
    console.error("Failed to update search count: ", error);
  }
};

const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    const result = await tablesDB.listRows<TrendingMovie>({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.orderDesc("count"), Query.limit(5)],
    });

    return result.rows;
  } catch (error) {
    console.error("Failed to fetch trending movies:", error);
    return [];
  }
};

export { client, account, tablesDB, updateSearchCount, getTrendingMovies };
