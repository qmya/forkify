import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; //parcel 2 if its an image you have to use url: with it

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query ! Please try again';
  _message = '';

  _generateMarkup() {
    //let loop through the this._data and return the elements value that we needed inside the HTML:
    //will return the string
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
