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
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";
import { app } from "../firebaseConfig";

export default function MovieSearch({ user }) {
  const [movies, setMovies] = useState([]); 
  const [search, setSearch] = useState(""); 
  const [filter, setFilter] = useState("All");
  const [favorites, setFavorites] = useState(new Set()); 
  const [reviews, setReviews] = useState({}); 

  const db = getFirestore(app); 

  useEffect(() => {
    if (user) {
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
      console.log("Fetched movies:", movieData); 
      setMovies(movieData); 
    } catch (error) {
      console.error("Error fetching movies:", error);
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
    try {
      const moviesCollection = collection(db, "movies");
      const q = query(moviesCollection, orderBy("title")); // Get all movies ordered by title
      const querySnapshot = await getDocs(q);
    
      const movieData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    
      // Remove spaces from both the search input and movie titles before comparing
      const formattedSearch = search.replace(/\s+/g, '').toLowerCase(); // Remove spaces and convert to lowercase
      
      const filteredMovies = movieData.filter((movie) =>
        movie.title.replace(/\s+/g, '').toLowerCase().includes(formattedSearch) // Remove spaces from movie title and compare
      );
    
      console.log("Search results:", filteredMovies);
      setMovies(filteredMovies);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
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
      setReviews((prevReviews) => ({
        ...prevReviews,
        [movieId]: "",
      }));
    } catch (error) {
      console.error("Error adding review:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div>
        <h1 className="text-3xl font-semibold">Search Movies</h1>
        <div className="flex space-x-4 mt-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title"
            className="flex-grow p-3 bg-gray-800 border border-gray-600 rounded-md"
          />
          <button
            onClick={handleSearch}
            className="p-3 bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>
        <div className="mt-4">
          <label htmlFor="filter" className="mr-2">Filter by Genre:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 bg-gray-800 border border-gray-600 rounded-md"
          >
            <option value="All">All</option>
            <option value="Crime">Crime</option>
            <option value="Drama">Drama</option>
            <option value="Action">Action</option>
            <option value="Horror">Horror</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Comedy">Comedy</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {movies.length === 0 ? (
          <p>No movies found.</p>
        ) : (
          movies.map((movie) => (
            <div key={movie.id} className="bg-gray-800 p-4 rounded-md">
              <h3 className="text-xl font-bold">{movie.title}</h3>
              <p className="text-sm text-gray-400">Genre: {movie.genre}</p>
              <p className="text-sm">Rating: {movie.rating}</p>
              <p className="text-sm">Year: {movie.releaseYear}</p>
              <p className="text-sm">Reviews: {movie.reviewsCount || 0}</p>

              <button
                onClick={() => toggleFavorite(movie.id)}
                className={`mt-2 p-2 rounded-md ${favorites.has(movie.id) ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"}`}
              >
                {favorites.has(movie.id) ? "Remove Favorite" : "Add to Favorite"}
              </button>

              <div className="mt-4">
                <textarea
                  value={reviews[movie.id] || ""}
                  onChange={(e) => handleReviewChange(movie.id, e)}
                  placeholder="Add a review..."
                  className="mt-2 p-2 w-full h-20 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
                <button
                  onClick={() => handleAddReview(movie.id)}
                  className="mt-2 p-2 bg-green-600 rounded-md hover:bg-green-700"
                >
                  Add Review
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
