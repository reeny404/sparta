// class MovieDatabase {
    
    // constructor(){
        // this.TMDB_API_KEY = 'bfc2b5b9ce28caed54a7db4ee4cc5cf4';
        // this.TMDB_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZmMyYjViOWNlMjhjYWVkNTRhN2RiNGVlNGNjNWNmNCIsInN1YiI6IjY2Mjc1ZDhlMmUyYjJjMDE0OTY2MWRmMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RtwVL4OBFnXowMVsSdUuCvPbxDLgHL6_gcrkyq5ILvo';
    // }

    async function getMovieList(page = 1, lang = 'en-US') {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer ' + this.TMDB_ACCESS_TOKEN
            }
        };

        return fetch(`https://api.themoviedb.org/3/movie/popular?language=${lang}&page=${page}`, options)
            .then(response => response.json())
            .catch(err => console.error(err));

    }

    // async getRatedMovies(page = 1){
    //     const options = {
    //         method: 'GET',
    //         headers: {
    //             accept: 'application/json',
    //             Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZmMyYjViOWNlMjhjYWVkNTRhN2RiNGVlNGNjNWNmNCIsInN1YiI6IjY2Mjc1ZDhlMmUyYjJjMDE0OTY2MWRmMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RtwVL4OBFnXowMVsSdUuCvPbxDLgHL6_gcrkyq5ILvo'
    //         }
    //     };

    //     return fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
    //         .then(response => response.json())
    //         .catch(err => console.error(err));
    // }
// }

// export {MovieDatabase};
export {getMovieList};