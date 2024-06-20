import axios from "axios";
import { useEffect, useState } from "react";
import { useUser, isAuthenticated } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import Link from "next/link";

export default function Display() {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(0);
  const [favorites, setFavorites] = useState({});
  const { user, isLoading, error } = useUser();
  console.log("USER: ", user);

  useEffect(() => {
    const fetchRecipes = async () => {
      const result = await axios.get(
        `https://dummyjson.com/recipes?limit=20&skip=${page * 20}`
      );
      setRecipes(result.data.recipes);
      console.log(result.data.recipes);
    };
    const fetchFavorites = async () => {
      if (user) {
        const result = await axios.get("/api/favorites", {
          params:{userId: user.sub},
        });
        const favoriteRecipes = result.data.reduce((acc, fav) => {
          acc[fav.recipeId] = true;
          return acc;
        }, {});
        setFavorites(favoriteRecipes);
        console.log("jj",favoriteRecipes);
      }
    };

    fetchRecipes();
    fetchFavorites();
  }, [page]);

  const handleFavorite = async (recipeId) => {
    const isFavorited = favorites[recipeId];
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [recipeId]: !isFavorited,
    }));

    if (user) {
      if (isFavorited) {
        await axios.delete("/api/favorites", {
          data: { userId: user.sub, recipeId: recipeId },
        });
      } else {
        await axios.post("/api/favorites", {
          userId: user.sub,
          recipeId: recipeId,
        });
      }
    } else {
      alert("Please login to favorite recipes");
    }
  };

  return (
<div className="min-h-screen bg-gray-100">
  {/* Navigation Bar */}
  <nav className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
    {user && (
      <div className="text-lg font-semibold">
        Welcome, <span>{user.nickname}</span>
      </div>
    )}
    {user && (
      <Link
        href="/api/auth/logout"
        className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-500"
      >
        Log out
      </Link>
    )}
  </nav>

  {/* Main Content */}
  <div className="container mx-auto py-8">
    <h1 className="font-bold text-3xl text-center mb-6">Delicious Delights Await!</h1>
    {isAuthenticated && <h1 className="text-center mb-4">{user.email}</h1>}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.length === 0 && (
        <div className="col-span-full text-center">
          <h1>No items to display</h1>
        </div>
      )}
      {recipes.map((recipe) => (
        <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-center">
            <img src={recipe.image} alt="" className="w-full h-64 object-cover" />
          </div>
          <div className="p-4 flex justify-between items-center">
            <p className="text-lg font-semibold">{recipe.name}</p>
            <button onClick={() => handleFavorite(recipe.id)} className="px-2">
              {!favorites[recipe.id] ? (
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              ) : (
                <svg
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                >
                  <path
                    d="M4.03553 1C1.80677 1 0 2.80677 0 5.03553C0 6.10582 0.42517 7.13228 1.18198 7.88909L7.14645 13.8536C7.34171 14.0488 7.65829 14.0488 7.85355 13.8536L13.818 7.88909C14.5748 7.13228 15 6.10582 15 5.03553C15 2.80677 13.1932 1 10.9645 1C9.89418 1 8.86772 1.42517 8.11091 2.18198L7.5 2.79289L6.88909 2.18198C6.13228 1.42517 5.10582 1 4.03553 1Z"
                    fill="#ff0059"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Pagination */}
    <div className="flex justify-center mt-8">
      <div className="flex justify-between py-4 w-full max-w-md">
        <button
          onClick={() => setPage(page - 1)}
          className={` rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-500 border-2 p-2 ${
            recipes.length === 0
              ? "border-red-500 text-white cursor-not-allowed"
              : "border-red-500 text-white"
          }`}
          disabled={page === 0}
        >
          Previous Page
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className={` rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-500 border-2 p-2 ${
            recipes.length === 0
              ? "border-red-500 text-white cursor-not-allowed"
              : "border-red-500 text-white"
          }`}
          
          disabled={recipes.length === 0}
        >
          Next Page 
        </button>
      </div>
    </div>
  </div>
</div>


  );
}

