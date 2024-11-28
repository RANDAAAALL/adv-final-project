"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { app, db } from "../firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const auth = getAuth(app);
  const router = useRouter();
  
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      fetchFavorites(user.uid);
    } else {
      console.log("No user authenticated");
    }
  }, [auth]);

  async function fetchFavorites(userId) {
    try {
      const favoritesCollection = collection(db, "favorites");
      const q = query(favoritesCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const favoriteMovieIds = querySnapshot.docs.map(doc => doc.data().movieId);
      
      if (favoriteMovieIds.length === 0) {
        console.log("No favorites found.");
        return;
      }

      const movieDetails = [];
      for (const movieId of favoriteMovieIds) {
        const movieRef = doc(db, "movies", movieId);
        const movieDoc = await getDoc(movieRef);

        if (movieDoc.exists()) {
          movieDetails.push({ id: movieDoc.id, ...movieDoc.data() });
        }
      }

      setFavoriteMovies(movieDetails);
    } catch (error) {
      console.error("Error fetching favorites: ", error);
    }
  }

  const goBackToSearch = () => {
    router.push("/search");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-semibold mb-6">Your Favorite Movies</h1>
      {favoriteMovies.length === 0 ? (
        <p>No favorite movies found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {favoriteMovies.map((movie) => (
            <div key={movie.id} className="bg-gray-800 p-4 rounded-md">
              <h3 className="text-xl font-bold">{movie.title}</h3>
              <p className="text-sm text-gray-400">Genre: {movie.genre}</p>
              <p className="text-sm">Rating: {movie.rating}</p>
              <p className="text-sm">Year: {movie.releaseYear}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={goBackToSearch}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
      >
        Back to Search
      </button>
    </div>
  );
}
