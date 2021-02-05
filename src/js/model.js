import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

//Here we write all our models
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
  },
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

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
    console.error(`${error} 🧨`);
    throw error;
  }
};

//////////////////////////////////////////////////////////////////////////////
//for seaching the data
//so here the controller will tell what to search for
//so query is the string the we wanted to search
export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    console.log(data);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });
    console.log(state.search.results);
  } catch (error) {
    console.error(`${error} 🧨`);
    throw error;
  }
};
//loadSearchResult('pizza');
//<a href="#5ed6604591c37cdc054bc90b"> Recipe 1</a>
//<a href="#5ed6604591c37cdc054bc886"> Recipe 2</a>
