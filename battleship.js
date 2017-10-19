var view = {
    //this method takes a string message and displays it in the message display area
    displayMessage: function (msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
        {
            locations: [0, 0, 0],
            hits: ["", "", ""]
        },
        {
            locations: [0, 0, 0],
            hits: ["", "", ""]
        },
        {
            locations: [0, 0, 0],
            hits: ["", "", ""]
        }],
    fire: function (guess) {
        for (i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!")

                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },
    isSunk: function (ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function () {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            }
            while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },

    generateShip: function () {
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    collision: function (locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
    }
};

var controller = {
    guesses: 0,
    finished: false,
    usedGuesses: [],

    processGuess: function (guess) {
        var location = parseGuess(guess);
        var index = this.usedGuesses.indexOf(location);

        if (this.usedGuesses.indexOf(location) >= 0) {
            console.log("you tried that location");
            view.displayMessage("You tried that location already!!!");
        } else {
            this.usedGuesses.push(location);
            if (location) {
                this.guesses++;
                var hit = model.fire(location);

                if (hit && model.shipsSunk === model.numShips) {
                    view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses. " + "Accuracy - " + Math.round(100 * (model.shipLength * model.numShips / this.guesses)) + "%")
                    controller.finished = true;
                } else if (controller.finished) {
                    alert("You sank all the ships already");
                }
                console.log(this.guesses);
            }
            console.log(this.usedGuesses);
        }

    }
};


function parseGuess(guess) {
    var alphaet = ["A", "B", "C", "D", "E", "F", "G"];
    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.")
    } else {
        var firstChar = guess.charAt(0).toLocaleUpperCase();
        var row = alphaet.indexOf(firstChar);
        var column = guess.charAt(1);
        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board!");
        } else {
            return row + column;
        }
    }
    return null;
}

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}

function showLocations() {
    var locations = "";
    for (var i = 0; i < model.ships.length; i++) {
        locations += "Ship " + (i + 1) + ": " + model.ships[i].locations + "\n";
    }
    console.log(locations);
    view.displayMessage(locations);
}

function activateShowLocationsButton() {
    document.getElementById("getLocations").disabled = false;
    document.getElementById("activateButton").disabled = true;
    view.displayMessage("\"Secret\" button activated. You can now check where the ships are located");
}

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);

    guessInput.value = "";
}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

window.onload = init;

view.displayMessage("Start!");

//////
//controller.processGuess("A6");
//controller.processGuess("B6");
//controller.processGuess("C6");
//////
//controller.processGuess("C4");
//controller.processGuess("D4");
//controller.processGuess("E4");
//
//
//////
//controller.processGuess("B0");
//controller.processGuess("B1");
//controller.processGuess("B2");
//
//controller.processGuess("B3");

//model.fire("53");
//model.fire("06");
//model.fire("16");
//model.fire("26");
//model.fire("34");
//model.fire("24");
//model.fire("44");
//model.fire("12");
//model.fire("11");
//model.fire("10");


/*
model.fire("53");
model.fire("06");
model.fire("16");
model.fire("26");
model.fire("34");
model.fire("24");
model.fire("44");
model.fire("12");
model.fire("11");
model.fire("10");
*/
/*
view.displayMiss("00");
view.displayHit("34");
view.displayMiss("55");
view.displayHit("12");
view.displayMiss("25");
view.displayHit("26");

view.displayMessage("Tap tap, is this thing on");
*/
