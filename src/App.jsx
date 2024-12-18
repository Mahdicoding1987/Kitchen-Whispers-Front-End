import { useState, createContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";
import SignupForm from "./components/SignupForm/SignupForm";
import SigninForm from "./components/SigninForm/SigninForm";
import * as authService from "../src/services/authService"; // import the authservice
import RecipeList from "./components/RecipeList/RecipeList";
import RecipeDetails from "./components/RecipeDetails/RecipeDetails";
import RecipeForm from "./components/RecipeForm/RecipeForm";
import CommentForm from './components/CommentForm/CommentForm';


// import the recipe service
import * as recipeService from "./services/recipeService";

export const AuthedUserContext = createContext(null);

const App = () => {
  const [user, setUser] = useState(authService.getUser()); // using the method from authservice
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchAllRecipes = async () => {
      const recipesData = await recipeService.index();
      //console.log(recipesData);
      setRecipes(recipesData);
    };
    if (user) fetchAllRecipes();
  }, [user]);

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  const navigate = useNavigate();

  const handleAddRecipe = async (recipeFormData) => {
    const newRecipe = await recipeService.create(recipeFormData);
    setRecipes([newRecipe, ...recipes]);
    navigate("/recipes");
  };

  const handleDeleteRecipe = async (recipeId) => {
    const deleteRecipe = await recipeService.deleteRecipe(recipeId);

    setRecipes(recipes.filter((recipe) => recipe._id !== recipeId));
    navigate("/recipes");
  };

  const handleUpdateRecipe = async (recipeId, recipeFormData) => {
    const updatedRecipe = await recipeService.update(recipeId, recipeFormData);

    setRecipes(
      recipes.map((recipe) =>
        recipeId === recipe._id ? updatedRecipe : recipe
      )
    );

    navigate(`/recipes/${recipeId}`);
  };

  return (
    <>
      <AuthedUserContext.Provider value={user}>
        <NavBar user={user} handleSignout={handleSignout} />
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route
                path="/recipes"
                element={<RecipeList recipes={recipes} />}
              />
              <Route
                path="/recipes/new"
                element={<RecipeForm handleAddRecipe={handleAddRecipe} />}
              />
              <Route
                path="/recipes/:recipeId"
                element={
                  <RecipeDetails handleDeleteRecipe={handleDeleteRecipe} />
                }
              />
              <Route
                path="/recipes/:recipeId/edit"
                element={<RecipeForm handleUpdateRecipe={handleUpdateRecipe} />}
              />
                            <Route
                path="/recipes/:recipeId/comments/:commentId/edit"
                element={<CommentForm handleUpdateRecipe={handleUpdateRecipe} />}
              />
            </>
          ) : (
            <Route path="/" element={<Landing />} />
          )}
          <Route path="/signup" element={<SignupForm setUser={setUser} />} />
          <Route path="/signin" element={<SigninForm setUser={setUser} />} />
        </Routes>
      </AuthedUserContext.Provider>
    </>
  );
};

export default App;
