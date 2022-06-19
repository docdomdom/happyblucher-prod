# Happy Blucher<br>

#### Video Demo: https://youtu.be/noEQxKg6hnI<br>

# Introduction:<br>

Welcome to my final project for the CS50 Web Course. With my Happy Blücher Application I provide a playing aid for my gaming community for the tabletop strategy game Blücher.

##### Distinctiveness and Complexity:<br>

In the past there have been two problems for the players in the Blucher gaming community. Normally they need a pen and paper to create their army lists and keep track of the units in the game. The other issue is the game can only be played with two players. While one player rolls the dice the other has to check the score secretly.

Up to now there hasn't been an application to deal with these two problems. Therefore I developed this project to fill this gap.

The Happy Blucher Application is designed as a one page application and takes the users inputs through a dash board like interface that keeps track of the bookkeeping and all calculations. This is the main part of the application. In order to give the user a great experience with a dynamic and interactive frontend I decided to learn and use REACT for this.

The generated data can then be saved in a database and restored again for signed in users. This is achieved with the Django framework with a SQLite database on the backend.
The generated data can also be printed out or exported in another window in unstyled plain text.

To overcome the problem of requiring two players for the secret dice rolls and playing the game solitarily I developed the "Momentum Dice Simulation". On an interactive screen you can select, roll and check the dice.

The application is also fully responsive and works well on all different screen sizes with the help of CSS display: flex and display: grid.

##### Requirements:<br>

If you want to use Django with REACT as frontend framework you need webpack as a static file bundler and several webpack loaders. This is because how Django handles static files.

python3
django
npm
babel/cli
babel/core
babel/preset-env
babel/preset-react
autoprefixer
babel-cli
babel-loader
babel-preset-react-app
css-loader
file-loader
image-webpack-loader
postcss-loader
postcss
react-bootstrap
react-dom
react
style-loader
url-loader
webpack-cli
webpack

##### File Content:<br>

./builder/templates/builder
index.html - contains the main html file and serves as an entry point for the one page application

./builder/static/builder
reactfile.js - the JSX code for the application (just for completeness, not required as it is included in bundle.js)
data.js - defines classes, methods and data for reactfile.js
styles.css - css styling for the application
custom.css - overwrites some bootstrap styling
favicon.js - the favicon
\*.png - modified images by webpack and moved in this static folder to work with DJANGO

./builder/static/builder/bundled
bundle.js - static files bundled with webpack

./builder/static/builder/images
the mediafolder with the background image used by the css
