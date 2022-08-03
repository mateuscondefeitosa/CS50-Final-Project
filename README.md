# SUDOKU BRAIN

#### Video Demo: https://youtu.be/2jCvK82w1w0
#
## Description:
This project is a Web App focused on a daily sudoku game competition (but it is not necessary to contend).

You can register your account and play the daily sudoku to earn a point per day. Or you can just play the daily game and have fun and with no compromises.

The game works that way:
    - You have 15 minutes to complete the full board;
    - You have 3 lives (can error 2 times);
    - After some error, your screen is locked for 1 second to not miss click again, and the number is turned RED for that same time for easy visualization;
    - If you lost, a message is displayed telling you that you Lost where the lives countdown was placed;
    - If you win, you will be redirected to the ranking page and a point will be added to your Points Account;
    - If you have more points than the other competitors, you rise in the rankings;
    - If you are the first rank, you gain a trophy.


Programming languages used in this project:

    - Front-end: HTML5, CSS3, Bootstrap5, Java Script;
    - Back-end: Python Flask framework;
    - DataBase: SQLite3;


How the project was made:

On the front-end side of things, the project uses HTML5 templates with the aid of JINJA template designer backed with CSS and BootStrap styles. JINJA help me where I can make a single layout page, and incorporate the right HTML page accordingly of the request made in the Back-end. There are 7 pages + an Error page in this project. JavaScript controls the workings of the game, creating the board, controlling the inputs, and managing the lives of the player and the timer countdown. Unfortunately, the sudoku board needed to be hard coded, because I just found paid APIs and I don't want to use them in this project, but I just need to change the initial board and solution, and the code gets along working fine.

On JavaScript we have 10 main functions:

    - window.onload: where I add Event Listeners to de buttons Start Game and the 1-9 Numbers;
    - function startGame: where I initialize my board game with the Lives countdown, timer, the board, and Numbers buttons;
    - function startTimer: where I start the timer countdown (changing it every second);
    - function timeConversion: where I describe how the timer display will work;
    - function createBoard: It's the function that creates the board itself, with withe spaces and initial numbers. And add Event Listeners to the tiles. This function helps me style some tiles to add the # that separates the little squares.
    - function updateMove: This function verify if the players move is correct or incorrect;
    - function checkDone: This function verify if every tile is completed with some number;
    - function endGame: This function ends the game. Clear the timer, and show the Lost msg if the player lost or make a POST request showing that the player won;
    - function checkCorrect: Checks if the number that the player put in a tile is the same as in the solution board.

On the back-end, Flask manages the routes, requests, processes, and updates in the database using GET/POST methods accordingly to the requests. Flask_session is used to maintain the user logged in to the website.

All the user's information (account name, hashed password and game points) is salved in the SQLite3 database.
