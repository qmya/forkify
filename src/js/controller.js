import * as model from './model.js'; //* = everything because we have two exports in this file.
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import 'core-js/stable'; //polyfilling everything else
import 'regenerator-runtime/runtime'; //polyfilling async await

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    //making a dynamic id for the url
    const id = window.location.hash.slice(1);

    if (!id) return; //guard clause
    recipeView.renderSpinner();

    // 1) Loading the recipe :
    await model.loadRecipe(id); //async function 👉🏽Here is the model.loadRecipe return anything
    //const recipe = model.state.recipe //We can write this like this too 👇🏽
    //const { recipe } = model.state;

    // 2) Rendering recipe:
    recipeView.render(model.state.recipe); // this render will accept this data (model.state.recipe) & will store it in the object(recipeView)
  } catch (error) {
    console.error(error);
    recipeView.renderError();
  }
};

//////////////////////////////////////////////////////
//Search
const controlSearchResults = async function () {
  try {
    //1) Get search Query:
    const query = searchView.getQuery();
    if (!query) return;

    //2) Load search results:
    await model.loadSearchResult(query);

    //3) Render the results:
    console.log(model.state.search.results);
  } catch (error) {
    console.log(error);
  }
};

//////////////////////////////////////////////////////
//adding eventlistner for the search
// window.addEventListener('hashChange', showRecipe);
// window.addEventListener('load', showRecipe);

//we can do the ☝🏽one through DRY method:
// ['hashChange', 'load'].forEach(event => addEventListener(event, controlRecipe));
const init = function () {
  //we will export the function from recipeView and add it here
  recipeView.addHandlerRender(controlRecipe);
  //Search
  searchView.addHandlerSearch(controlSearchResults);
};
init();
