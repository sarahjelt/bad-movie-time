// import axios from 'axios';

export default {
  searchByQuery: function(query) {
    return fetch(`
      https://api.themoviedb.org/3/search/movie?api_key=6df7d06e1b9b586ab617bf9997934aaa&query=${query}&include_adult=false`)
    .then(res => res.json())
  }
}