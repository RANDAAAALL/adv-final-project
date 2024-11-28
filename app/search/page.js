"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import MovieSearch from "../components/MovieSearch";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";  

export default function MainContent() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User authenticated:", currentUser);  
        setUser(currentUser);
      } else {
        console.log("No user authenticated");  
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {user ? (
        <div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
    
              <User className="w-10 h-10 text-white" />
              <span className="ml-3 text-lg font-semibold">
          
                {user.email || "User"} 
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
            >
              <LogOut className="mr-2 inline-block" />
              Log out
            </button>
          </div>

          <div className="flex space-x-4 p-4">
            <button
              onClick={() => router.push("/favorites")}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
            >
              Favorites
            </button>
          </div>

          <MovieSearch user={user} />
        </div>
      ) : (
        null
      )}
    </div>
  );
}
