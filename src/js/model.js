import { async } from 'regenerator-runtime';

//Here we write all our models
export const state = {
  recipe: {},
};

export const loadRecipe = async function (id) {
  try {
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    //always we convert the response into json
    const data = await res.json();
    //if the id is not right than throw a new error
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    console.log(res, data);

    //let create a new recipe object to remove the underscore from the name
    //let recipe = data.data.recipe; //destructure it
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(state.recipe);
  } catch (error) {
    console.log(error);
  }
};
