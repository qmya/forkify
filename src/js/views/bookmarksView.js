import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; //parcel 2 if its an image you have to use url: with it

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmark yet. Find a nice recipe and bookmark it';
  _message = '';

  _generateMarkup() {
    console.log(this._data);
    //let loop through the this._data and return the elements value that we needed inside the HTML:
    //will return the string
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
