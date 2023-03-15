// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=113fc6b9
// search movies OMDb API: `http://www.omdbapi.com/?s=${tt3896198}&apikey=113fc6b9`

let inputMovies = document.getElementById('search-movies');
let list_items = document.getElementById('list-items');
let movie_info = document.getElementById('movie-info');
let search_bar = document.getElementById('search-container');
let search_title = document.getElementById("search-title");
let list_container = document.getElementById("list-container");

let header_container = document.querySelector('.header');
let main_container = document.querySelector('.main');
let favorite_title = document.getElementById("favorite-title");
let goBack_search = document.getElementById('list-search');

let fav_list = [];


// list of search hide
list_items.style.display = "none";
search_title.style.display = "none";

// search input movie title asynchronus
async function fetchMovies(movieName) {
    const response = await fetch(`http://www.omdbapi.com/?s=${movieName}&apikey=113fc6b9`);
    const data = await response.json();
    // console.log(data);
    if (data.Response == 'True') {
        // console.log(data.Search);
        // pass all movie array of object that have same name
        showMovieList(data.Search);
    }
}

// fetchMovies("lord of the ring");

function showMovieList(list) {
    
    // console.log("list show movies", list);
    list_items.style.display = "block";
    
    let div_inner;

    list.forEach((movie_list)=>{
        // console.log(movie_list);
        if(movie_list.Poster != 'N/A'){
            div_inner = document.createElement('div');

            div_inner.innerHTML = `
            <li class="k-li" id="${movie_list.imdbID}">
                <img class="list-img" src="${movie_list.Poster}"alt="img not found">

                <h4 class="list-title">${movie_list.Title} 
                    <p class="list-year">${movie_list.Year}</p>
                </h4>
            </li>
            `;

            list_items.appendChild(div_inner);

            document.getElementById(`${movie_list.imdbID}`).addEventListener('click', function(){
                // console.log(this.parentElement);
                // console.log(this);
                
                showMovieDetails(this);
            });
        }
    });

}

async function showMovieDetails(event){
    // console.log(event.id);

    const response = await fetch(`http://www.omdbapi.com/?i=${event.id}&apikey=113fc6b9`);
    const data = await response.json();
    // console.log(data);
    
    if(data.Response == 'True'){
        search_bar.style.display = 'none';
        movie_info.style.display = 'block';
        search_title.style.display = "block";

        movie_info.innerHTML = `
            <div class="m-image">
                <img id="m-image" src="${data.Poster}" alt="m-image">
            </div>

            <div id="m-info">
                <h2 id="m-title">${data.Title}</h2>

                <h4 id="m-year">${data.Released}</h4>

                <h4 class="imdb-rating">IMDb Rating : <span id="m-rating">${data.Ratings[0].Value}</span></h4>

                <h4 class="time">Time : <span id="m-time">${data.Runtime}</span></h4>

                <h4 class="plot">Plot : <span id="m-plot">${data.Plot}</span></h4>

                <h4 class="director">Director :  <span id="m-director">${data.Director}</span></h4>

                <h4 class="writer">Writers :  <span id="m-writer">${data.Writer}</span></h4>

                <h4 class="star">Stars :  <span id="m-stars">${data.Actors}</span></h4>

                <button class="m-addbtn" id="${data.imdbID}" type="button">Add to favorite</button>
            </div>
        `;

        document.querySelector('.m-addbtn').addEventListener('click', function(){
            // addFavorite(this);
            addFavorite(this.id);
            alert("Movie is added to favorite list");
            display_search();
        });
    }

}


function searchMovies() {
    // console.log(inputMovies.value);
    // let searchName = inputMovies.value.trim();

    let searchName = inputMovies.value;

    // unorder list empty 
    list_items.innerHTML = "";

    if (searchName.length > 0) {
        fetchMovies(searchName);
    }else{
        // search movie below list hide
        list_items.style.display = "none";
    }
}

// press any key
inputMovies.addEventListener('keyup', searchMovies);


// press search_title to search another movies
search_title.addEventListener('click', display_search);

function display_search(){
    search_bar.style.display = 'block';
    movie_info.style.display = 'none';
    search_title.style.display = "none";
    inputMovies.value = "";
    list_items.style.display = "none";
}


// add movie to favorite by clicking add button
// add movie to favorite even refresh the page
async function addFavorite(id){
    // console.log(e.id);
    // console.log(e);

    // add to local storage
    fav_list.push(id);
    localStorage.setItem('favMoviesList', JSON.stringify(fav_list));


    const response = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=113fc6b9`);
    const data = await response.json();

    let li = document.createElement('li');
    li.innerHTML = `
        <img src="${data.Poster}" alt="movie image">
        <h3>${data.Title}</h3>
        <h3>${data.Released}</h3>
        <i id="data.imdbID" class="fa-solid fa-trash"></i>
    `;

    list_container.appendChild(li);

    li.lastElementChild.addEventListener('click', function(){
        // console.log('click to delete btn');
        // console.log(this);
        // console.log(data.imdbID);

        // movie remove from localstorage
        let moviesList = JSON.parse(localStorage.getItem('favMoviesList'));
        fav_list = moviesList.filter(List => List != data.imdbID);
        localStorage.setItem('favMoviesList', JSON.stringify(fav_list));

        // movie remove form favorite movies list
        this.parentElement.remove();
    })
}


// click to favorite title than show favrite movie lists
favorite_title.addEventListener('click', function(){
    header_container.style.display = 'none';
    main_container.style.display = 'block';
    search_title.style.display = "block";
})


// go back form favorite movies list to search (home page)
goBack_search.addEventListener('click', function(){
    // console.log('click to search');
    header_container.style.display = 'block';
    main_container.style.display = 'none';
});



// if refresh the page so list of movie show not remove
// Make this list persistent (should have the same number of movies before and after closing the browser/refreshing the browser).
(()=>{
    // get data from local storage
    let moviesList = JSON.parse(localStorage.getItem('favMoviesList'));
    // console.log(moviesList);
    if(moviesList){
        moviesList.forEach((id) => {
            addFavorite(id);
        })
    }
})();