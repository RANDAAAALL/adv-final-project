"use client";

import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { app } from "../firebaseConfig";

export default function MovieSearch({ user }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [favorites, setFavorites] = useState(new Set());
  const [reviews, setReviews] = useState({});

  const db = getFirestore(app);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchMovies();
      fetchFavorites();
    }
  }, [filter, user]);

  async function fetchMovies() {
    try {
      const moviesCollection = collection(db, "movies");
      let q = moviesCollection;

      if (filter !== "All") {
        q = query(moviesCollection, where("genre", "==", filter));
      }

      const querySnapshot = await getDocs(q);
      const movieData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMovies(movieData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setIsLoading(false);
    }
  }

  async function fetchFavorites() {
    if (!user) return;

    try {
      const favoritesCollection = collection(db, "favorites");
      const q = query(favoritesCollection, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const favoriteMovies = new Set(
        querySnapshot.docs.map((doc) => doc.data().movieId)
      );
      setFavorites(favoriteMovies);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  }

  async function toggleFavorite(movieId) {
    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    const isFavorite = favorites.has(movieId);

    try {
      if (isFavorite) {
        const q = query(
          collection(db, "favorites"),
          where("userId", "==", user.uid),
          where("movieId", "==", movieId)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        setFavorites((prev) => new Set([...prev].filter((id) => id !== movieId)));
      } else {
        await addDoc(collection(db, "favorites"), {
          userId: user.uid,
          movieId: movieId,
        });
        setFavorites((prev) => new Set(prev.add(movieId)));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  }

  async function handleSearch() {
    setIsLoading(true);

    setTimeout(async () => {
      try {
        const moviesCollection = collection(db, "movies");
        const q = query(moviesCollection, orderBy("title"));
        const querySnapshot = await getDocs(q);

        const movieData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const formattedSearch = search.replace(/\s+/g, "").toLowerCase();

        const filteredMovies = movieData.filter((movie) =>
          movie.title.replace(/\s+/g, "").toLowerCase().includes(formattedSearch)
        );

        setMovies(filteredMovies);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  }

  function handleReviewChange(movieId, event) {
    setReviews((prevReviews) => ({
      ...prevReviews,
      [movieId]: event.target.value,
    }));
  }

  async function handleAddReview(movieId) {
    const reviewText = reviews[movieId];
    if (!reviewText) return;

    try {
      await addDoc(collection(db, "reviews"), {
        movieId,
        review: reviewText,
        userId: user.uid,
        timestamp: new Date(),
      });

      const movieRef = doc(db, "movies", movieId);
      const movieDoc = await getDoc(movieRef);

      if (movieDoc.exists()) {
        const currentReviewsCount = movieDoc.data().reviewsCount || 0;

        await updateDoc(movieRef, {
          reviewsCount: currentReviewsCount + 1,
        });

        setMovies((prevMovies) =>
          prevMovies.map((movie) =>
            movie.id === movieId
              ? { ...movie, reviewsCount: currentReviewsCount + 1 }
              : movie
          )
        );
      }

      setReviews((prevReviews) => ({
        ...prevReviews,
        [movieId]: "",
      }));
    } catch (error) {
      console.error("Error adding review:", error);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div>
        <h1 className="text-5xl font-bold text-center text-indigo-500 mb-10">
          🎥 Movie Vault
        </h1>
        <div className="flex justify-center items-center gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full max-w-lg p-4 rounded-md bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-400"
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-md shadow-lg transform transition hover:scale-105"
          >
            Search
          </button>
        </div>
        <div className="mt-8 flex justify-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-3 bg-gray-800 text-gray-300 rounded-md focus:ring-4 focus:ring-indigo-400"
          >
            <option value="All">All Genres</option>
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
            <option value="Horror">Horror</option>
            <option value="Comedy">Comedy</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Crime">Crime</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center text-slate-50 text-bold text-3xl min-h-screen">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {movies.length === 0 ? (
            <p className="text-center text-gray-400">No movies found.</p>
          ) : (
            movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-900 p-6 rounded-lg shadow-lg"
              >
                {movie.ImageUrl && (
                  <img
                    src={movie.ImageUrl}
                    alt={movie.title}
                    className="w-full h-64 object-cover rounded-md mb-4"
                  />
                )}
                <h2 className="text-2xl font-semibold text-indigo-400">
                  {movie.title}
                </h2>
                <p className="mt-2 text-gray-400">
                  🎭 Genre: <span className="text-gray-300">{movie.genre}</span>
                </p>
                <p className="mt-2 text-gray-400">
                  ⭐ Rating: <span className="text-gray-300">{movie.rating}</span>
                </p>
                <p className="mt-2 text-gray-400">
                  📝 Reviews:{" "}
                  <span className="text-gray-300">
                    {movie.reviewsCount || 0}
                  </span>
                </p>
                <textarea
                  className="mt-4 w-full p-2 bg-gray-800 text-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  style={{ resize: "none" }}
                  placeholder="Add your review..."
                  value={reviews[movie.id] || ""}
                  onChange={(e) => handleReviewChange(movie.id, e)}
                ></textarea>
                <button
                  onClick={() => handleAddReview(movie.id)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 mt-2 rounded-md w-full"
                >
                  Submit Review
                </button>
                <button
                  onClick={() => toggleFavorite(movie.id)}
                  className={`mt-4 w-full py-2 rounded-md ${
                    favorites.has(movie.id)
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white`}
                >
                  {favorites.has(movie.id) ? "Remove from Favorites" : "Add to Favorites"}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
