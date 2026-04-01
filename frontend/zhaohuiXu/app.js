fetch('http://localhost:3000/api/movies')
    .then(response => response.json())
    .then(data => console.log("movie data: ", data));