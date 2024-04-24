const POPULAR = 0;
const SEARCH = 1;

function init () {
  // 페이지 최초 로딩 시, 인기 영화 목록 보여주기
  changeMovieListView(POPULAR);

  // 검색 창에 focus 주기
  const searchInput = document.getElementById('query'); 
  searchInput.focus();

  // 찾기 버튼 이벤트 걸기
  const submitButton = document.querySelector('#App > .container > .search-box > button.btn-search');
  submitButton.addEventListener('click', () => {
    if (searchInput.value) {
      changeMovieListView(SEARCH, searchInput.value);
    } else {
      changeMovieListView(POPULAR);
    }
  });

  searchInput.addEventListener('keyup', (e) =>{
    // enter 쳤거나, input 값이 clear 되면 다시 인기 순으로
    if (e.key == 'Enter' | !searchInput.value) {
      submitButton.click();
    }
  });

  //언어 선택 변경 시
  const selectBox = document.getElementById('language'); 
  selectBox.addEventListener('change', () => {
    const lang = selectBox.options[selectBox.selectedIndex].value;
    movieDB.setLanguage(lang);

    // 화면 다시 그려야지
    searchInput.value 
      ? changeMovieListView(SEARCH, searchInput.value)
      : changeMovieListView(POPULAR);
  });
}

/**
 * API 호출 및 데이터 관리 
 */
class MovieDatabase {
  constructor(){
    this.key = 'bfc2b5b9ce28caed54a7db4ee4cc5cf4';
    this.options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.key}`
      }
    }

    this.urls = {
      popular : 'https://api.themoviedb.org/3/movie/popular',
      search : 'https://api.themoviedb.org/3/search/movie'
    }

    this.language = 'en-US';
    this.isChanged = true;
    this.lastPopularList = null;
  }

  setLanguage(lang) {
    this.language = lang;
    this.isChanged = true;
  }

  getParamQuery(page = 1) {
    return `api_key=${this.key}&language=${this.language}&page=${page}`;
  }

  /** 최초 페이지 로딩 시, 영화 인기차트 가져오기 */
  async getPopuplarList(page) {
    if (!this.isChanged) {
      return this.lastPopularList;
    }

    this.isChanged = false;
    return fetch(`${this.urls.popular}?${this.getParamQuery(page)}`, this.options)
      .then(response => response.json())
      .then(response => this.lastPopularList = response.results)
      .catch(err => console.error(err));
  }

  /** 검색하기 */
  async search(keyword, page) {
    return fetch(`${this.urls.search}?${this.getParamQuery(page)}&query=${keyword}`, this.options)
      .then(response => response.json())
      .then(response => response.results)
      .catch(err => console.error(err));
  }
}

/** 영화 정보를 이용해 html view 만들기 */
const MovieHtmlMaker = {
  makeAll : function(movies) {
    if (!movies?.length) {
      return '정보가 없습니다 :(';
    }

    let html = '';
    movies.map(movie => {
      html += this.makeOne(movie);
    });
    return html;
  },
  makeOne : function (movie) {
    const imagePath = movie.backdrop_path 
      ? `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}` 
      : './asset/no-image.png'; 

    return `
      <div class="movie-container clickable" attr-id="${movie.id}">
        <div class="movie-poster">
          <img src="${imagePath}">
        </div>
        <div class="movie-content">
          <div class="star">${Math.floor(movie.vote_average* 10) / 10}</div>
          <div class="title">${movie.title}</div>
          <div class="desc">${movie.overview}</div>
        </div>
      </div>`;
  }
};

const movieDB = new MovieDatabase();

/** 영화 데이터 정보 변경되었을 때 view 변경하는 부분 */
const wrapper = document.querySelector('#App > .movie-list');
function changeMovieListView(type, keyword) {
  getMovieList(type, keyword).then((movies) => {
    const html = MovieHtmlMaker.makeAll(movies);
    wrapper.innerHTML = html;

    wrapper.querySelectorAll('.movie-container')
      .forEach(element => {
        element.addEventListener('click', () => 
          alert(`영화 id: ${element.attributes['attr-id'].value}`
        ));
      });
  });
}

async function getMovieList(type, keyword) {
  return type == POPULAR ? movieDB.getPopuplarList() : movieDB.search(keyword);
}


init();