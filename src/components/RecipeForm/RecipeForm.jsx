import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as recipeService from "../../services/recipeService";
import "./RecipeForm.css";

const RecipeForm = (props) => {
  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    steps: "",
    cookingTime: "",
    difficulty: "Easy",
  });

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (recipeId) {
      props.handleUpdateRecipe(recipeId, formData);
    } else {
      props.handleAddRecipe(formData);
    }
  };

  const { recipeId } = useParams();

  useEffect(() => {
    const fetchrecipe = async () => {
      const recipeData = await recipeService.show(recipeId);
      setFormData(recipeData);
    };
    if (recipeId) fetchrecipe();
  }, [recipeId]);

  return (
    <main className="RecipeForm">
      <form onSubmit={handleSubmit}>
        <h1>{recipeId ? "Edit Recipe" : "New Recipe"}</h1>
        <label htmlFor="title">Title:</label>
        <input required type="text" name="title" id="title" value={formData.title} onChange={handleChange} />

        <label htmlFor="ingredients">Ingredients:</label>
        <textarea
          required
          type="text"
          name="ingredients"
          id="ingredients-input"
          value={formData.ingredients}
          onChange={handleChange}
        />

        <label htmlFor="steps">Steps:</label>
        <textarea required type="text" name="steps" id="steps-input" value={formData.steps} onChange={handleChange} />

        <label htmlFor="cookingTime">Cooking Time:</label>
        <input
          required
          type="number"
          name="cookingTime"
          id="cookingTime"
          value={formData.cookingTime}
          onChange={handleChange}
        />

        <label htmlFor="difficulty-input">Difficulty</label>
        <select required name="difficulty" id="difficulty-input" value={formData.difficulty} onChange={handleChange}>
          <option value="Easy">Easy</option>
          <option value="Normal">Normal</option>
          <option value="Hard">Hard</option>
        </select>
        <button type="submit">SUBMIT</button>
      </form>
    </main>
  );
};

export default RecipeForm;
