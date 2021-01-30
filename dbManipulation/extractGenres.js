const data = require('./data.json');

// This script is used to get all genres in all the movies in the json and get the unique ones.

let i = 0
let allGenres = []
data.forEach(el => {
  el.genres.forEach(g => {
    if (!allGenres.includes(g)){
      allGenres.push(g)
    }
  })
  i++
})
console.log(allGenres)