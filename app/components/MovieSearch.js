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
      setTimeout(() => {
        fetchMovies(); 
        fetchFavorites(); 
      }, 2000);
    }
  }, [filter, user]);

  // Fetch movies based on filter
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
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setIsLoading(false);
    }
  }

  // Fetch favorite movies for the user
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

  // Toggle favorite status of a movie
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

  // Search function for movies
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

        const formattedSearch = search.replace(/\s+/g, '').toLowerCase(); 

        const filteredMovies = movieData.filter((movie) =>
          movie.title.replace(/\s+/g, '').toLowerCase().includes(formattedSearch)
        );

        console.log("Search results:", filteredMovies);
        setMovies(filteredMovies);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false); 
      }
    }, 2000); 
  }

  // Handle review text change for a specific movie
  function handleReviewChange(movieId, event) {
    setReviews((prevReviews) => ({
      ...prevReviews,
      [movieId]: event.target.value, // Update the review for the specific movie
    }));
  }

  // Add a review for a specific movie
  async function handleAddReview(movieId) {
    const reviewText = reviews[movieId];
    if (!reviewText) return;

    try {
      // Add the review to the 'reviews' collection
      await addDoc(collection(db, "reviews"), {
        movieId,
        review: reviewText,
        userId: user.uid,
        timestamp: new Date(),
      });

      // Update the reviewsCount in the 'movies' collection
      const movieRef = doc(db, "movies", movieId);
      const movieDoc = await getDoc(movieRef);

      if (movieDoc.exists()) {
        // Get current review count or initialize to 0
        const currentReviewsCount = movieDoc.data().reviewsCount || 0;

        // Increment the review count by 1
        await updateDoc(movieRef, {
          reviewsCount: currentReviewsCount + 1,
        });
      }

      // Clear the review input field after submitting
      setReviews((prevReviews) => ({
        ...prevReviews,
        [movieId]: "",  // Clear review field for this movie
      }));

      console.log(`Review for movie ${movieId} added successfully!`);
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
      {isLoading ? (
        <div className="flex justify-center items-center text-slate-50 text-3xl font-bold min-h-screen">Loading....</div>
      ) : (
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
                    onChange={(e) => handleReviewChange(movie.id, e)} // Call the review change handler
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
      )}
    </div>
  );
}

