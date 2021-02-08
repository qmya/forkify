import { async } from 'regenerator-runtime';
import { API_URL, RESULT_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

//Here we write all our models
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1, //by default
    resultsPerPage: RESULT_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  //let create a new recipe object to remove the underscore from the name
  //let recipe = data.data.recipe; //destructure it
  const { recipe } = data.data;
  return {
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
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

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
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
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
    state.search.page = 1; // new search the page will reset to page 1
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

/////////////////////////////////////////////////////////
//Update the servings
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    //FORMULA:  newQt = oldQuantity * newServings / oldServings ;
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};
/////////////////////////////////////////////////////////
//Local store the bookmarks
export const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
/////////////////////////////////////////////////////////
//BookMark the data
export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);

  //we also want to mark current recipe to be bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};
/////////////////////////////////////////////////////////
//remove bookmark
export const deleteBookmark = function (id) {
  //delete the bookmark:
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //We want to remove bookmark from that recipe
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};
/////////////////////////////////////////////////////////
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
console.log(state.bookmarks);
/////////////////////////////////////////////////////////
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

///////////////////////////////////////////////////////////
//upload the recipe to api

export const uploadRecipe = async function (newRecipe) {
  //converting newRecipe object into array => Object.entries(newRecipe)
  //filter on the ingredient and remove the emty ingredients
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        //const ingArr = ing[1].replaceAll(' ', '').split(','); // replaceAll =>remove white space ( ' ', replace with  empty string '')
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format 😊'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    //sendJSON have two perimeter 1 is URL and other is data.
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    console.log(data);
  } catch (err) {
    throw err;
  }
};
