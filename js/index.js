getMovieList().then(response => {
  const wrapper = document.querySelector('#App > .movie-list');

  const html = MovieHtmlMaker.makeMovieContinaers(response.results);
  wrapper.innerHTML = html;
});


const MovieHtmlMaker = {
  makeMovieContinaers : function(wrapper, movies) {
    if (!movies?.length) {
      return '정보가 없습니다 :(';
    }

    let html = '';
    movies.map(movie => {
      html += this.makeMovieHtml(movie);
    });
    return html;
  },
  makeMovieHtml : function (movie) {
    return `
      <div class="movie-container">
        <div class="movie-poster">
          <img src="https://image.tmdb.org/t/p/w500/${movie.backdrop_path}">
        </div>
        <div class="movie-content">
          <div class="star">${movie.vote_average}</div>
          <div class="title">${movie.title}</div>
          <div class="desc">${movie.overview}</div>
        </div>
      </div>`;
  }
};

async function getMovieList(page = 1, lang = 'en-US') {
  const key = 'bfc2b5b9ce28caed54a7db4ee4cc5cf4';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + key
    }
  };
  return fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=${lang}&page=${page}`, options)
    .then(response => response.json())
    .catch(err => console.error(err));
}