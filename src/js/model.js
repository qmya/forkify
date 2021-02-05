import { async } from 'regenerator-runtime';
import { API_URL, RESULT_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

//Here we write all our models
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1, //by default
    resultsPerPage: RESULT_PER_PAGE,
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
      ...(recipe.key && { key: recipe.key }),
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
        ...(recipe.key && { key: recipe.key }),
      };
    });
    console.log(state.search.results);
  } catch (error) {
    console.error(`${error} 🧨`);
    throw error;
  }
};

/////////////////////////////////////////////////////////
//paginations
export const getSearchResultsPage = function (page = state.search.page) {
  //lets save the page so we know that which page we are now and when we go back that previous page is saved inthe state
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0; let page = 1 1-1*10=0
  const end = page * state.search.resultsPerPage; //9;
  return state.search.results.slice(start, end);
};
