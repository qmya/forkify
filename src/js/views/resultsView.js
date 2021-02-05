import View from './View.js';
import icons from 'url:../../img/icons.svg'; //parcel 2 if its an image you have to use url: with it

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query ! Please try again';
  _message = '';

  _generateMarkup() {
    console.log(this._data);
    //let loop through the this._data and return the elements value that we needed inside the HTML:
    //will return the string
    return this._data.map(this._generateMarkupPreview).join('');
  }
  _generateMarkupPreview(result) {
    return `
        <li class="preview">
            <a class="preview__link " href="#${result.id}">
                <figure class="preview__fig">
                    <img src="${result.image}" alt="${result.title}" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${result.title}</h4>
                    <p class="preview__publisher">${result.publisher}</p>
                    
                </div>
            </a>
        </li>
        `;
  }
}

export default new ResultsView();

//<div class="preview__user-generated">
//  <svg>
//   <use href="${icons}#icon-user"></use>
//</svg>
//</div>
