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
  }

  getParamQuery(page = 1, lang = 'en-US') {
    return `api_key=${this.key}&language=${lang}&page=${page}`;
  }

  /** 최초 페이지 로딩 시, 영화 인기차트 가져오기 */
  async getPopuplarList() {
    return fetch(`${this.urls.popular}?${this.getParamQuery()}`, this.options)
      .then(response => response.json())
      .catch(err => console.error(err));
  }

  /** 검색하기 */
  async search(keyword) {
    return fetch(`${this.urls.search}?${this.getParamQuery()}&query=${keyword}`, this.options)
      .then(response => response.json())
      .catch(err => console.error(err));
  }
}

// -------------------- start ------------------------ 
const movieDB = new MovieDatabase();
const wrapper = document.querySelector('#App > .movie-list');

// 페이지 최초 로딩 시, 인기 영화 목록 보여주기
movieDB.getPopuplarList()
  .then(response => {
    changeMovieListView(wrapper, response.results);
  });

// 검색 창에 focus 주기
const searchInput = document.getElementById('query'); 
searchInput.focus();

// 찾기 버튼 이벤트 걸기
const button = document.querySelector('#App > .container > .search-box > button.btn-search');
button.addEventListener('click', function() {
  const keyword = searchInput.value;
  if(!keyword){
    // 메세지 입력 안했을 때
    return;
  }

  const className = 'searching'
  button.classList.add(className);
  movieDB.search(keyword)
    .then((response) => {
      changeMovieListView(wrapper, response.results);
      button.classList.remove(className);
    });
});
// -------------------- end ------------------------

/** 영화 데이터 정보 변경되었을 때 view 변경하는 부분 */
function changeMovieListView(wrapper, movies){
  const html = MovieHtmlMaker.makeAll(movies);
  wrapper.innerHTML = html;
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
      <div class="movie-container clickable">
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