import * as model from './model.js'; //* = everything because we have two exports in this file.
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

import 'core-js/stable'; //polyfilling everything else
import 'regenerator-runtime/runtime'; //polyfilling async await
import { async } from 'regenerator-runtime/runtime';

//this is not javascript its comming from parcel
if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    //making a dynamic id for the url
    const id = window.location.hash.slice(1);

    if (!id) return; //guard clause
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading the recipe :
    await model.loadRecipe(id); //async function 👉🏽Here is the model.loadRecipe return anything
    //const recipe = model.state.recipe //We can write this like this too 👇🏽
    //const { recipe } = model.state;

    // 2) Rendering recipe:
    recipeView.render(model.state.recipe); // this render will accept this data (model.state.recipe) & will store it in the object(recipeView)
    //Test
    //controlServing();
  } catch (error) {
    console.error(error);
    recipeView.renderError();
  }
};

//////////////////////////////////////////////////////
//Search
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1) Get search Query:
    const query = searchView.getQuery();
    if (!query) return;

    //2) Load search results:
    await model.loadSearchResult(query);

    //3) Render the results:
    resultsView.render(model.getSearchResultsPage(1));

    //4)Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

//////////////////////////////////////////////////////
//controller for page button
const controlPagination = function (goToPage) {
  console.log(goToPage);
  //1) Render the NEW results:
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2)Render initial pagination buttons
  paginationView.render(model.state.search);
};

//increase and decrease number of serving by clicking the button
const controlServings = function (newServings) {
  console.log('serving ');
  //update the recipe servings(in state)
  model.updateServings(newServings);

  //update the recipe view as well
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

//////////////////////////////////////////////////////
//Bookmark controller:
const controlAddBookmark = function () {
  //1) Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2) Update the recipe view bookmark icon
  recipeView.update(model.state.recipe);

  //3) Render the list of bookmarks
  bookmarksView.render(model.state.bookmarks);
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
  //serving button
  recipeView.addHandlerUpdateServings(controlServings);
  //Bookmark button
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  //Search
  searchView.addHandlerSearch(controlSearchResults);
  //page button
  paginationView.addHandlerClick(controlPagination);

  // controlServing();
};
init();
