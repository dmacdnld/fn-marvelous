#fn-marvelous

Playground for functional concepts using Marvel data.


##Getting Started

1.  Clone this repo

        git clone https://github.com/dmacdnld/fn-marvelous.git

2.  Install dependencies

        npm install

3.  Start the server

        npm start

4.  Go to <http://localhost:3000/>


##Iterations

There are iterations of the app in `public/js/src`. They all accomplish the same task, but each explore a new concept. To run the app with another iteration:

1.  Update the `webpack.config.js` file's `entry` property to point the desired file (e.g. `"./public/js/src/fn_v1.js"`)

2.  Build

        npm run dist

3.  Refresh the page