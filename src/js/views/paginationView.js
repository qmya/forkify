import View from './View.js';
import icons from 'url:../../img/icons.svg'; //parcel 2 if its an image you have to use url: with it

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  //adding handler for the page buttons
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline'); //closest element

      if (!btn) return; //get another guaerd clause

      //get the number from the button
      const goToPage = +btn.dataset.goto;
      console.log(goToPage);

      handler(goToPage);
    });
  }
  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);

    //Page 1 and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return `
        <button data-goto= "${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
          `;
    }

    //Last page
    if (currentPage === numPages && numPages > 1) {
      return `
        <button data-goto= "${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>`;
    }
    //other page
    if (currentPage < numPages) {
      return `
        <button data-goto= "${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
        <button data-goto= "${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>

      `;
    }
    //Page 1 and there are NO other pages
    return ''; //here we dont want to render any button
  }
}

export default new PaginationView();
