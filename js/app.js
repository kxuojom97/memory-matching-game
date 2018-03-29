"use strict";

const TILE_NUM = 8;

var move = 1;
var clock = {
    startTime: undefined,
    timer: undefined
}

var stats = {
    matches: undefined,
    missed: undefined,
    remaining: undefined
}

var lastTile = {
    img: undefined,
    element: undefined
}

/**
 * Shuffles an array in-place.
 * Source: https://bost.ocks.org/mike/shuffle/
 * @param {[]} array 
 * @returns {[]} the shuffled input array
 */
function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

/**
 * Returns a shallow copy of the object by
 * copying all of its properties to a new object.
 * @param {Object} obj - an object to copy
 * @returns {Object} a shallow clone of the object
 */
function cloneObject(obj) {
    return Object.assign({}, obj);
}

function newGame() {
    //TODO: add code to implement the game

    clock.startTime = Date.now();
    clock.timer = window.setInterval(function(){
        renderClock(clock);
    }, 1000);

    stats.matches = 0;
    stats.missed = 0;
    stats.remaining = TILE_NUM;
    renderStats(stats);

    let tileArray = shuffle(TILES).slice(0, TILE_NUM).map(cloneObject);
    let pairArray = shuffle(tileArray.map(cloneObject));
    tileArray = tileArray.concat(pairArray);
    let tiles = document.querySelector("#tiles");
    tiles.textContent = "";
    for (let i = 0; i < tileArray.length; i++) {
        tiles.appendChild(renderTile(tileArray[i]));
    }
}

function renderTile(tile) {
    let tileDiv = document.createElement("div");
    tileDiv.classList.add("tile-div");
    tileDiv.classList.add("col-3");

    let button = document.createElement("button");
    button.classList.add("btn");
    button.setAttribute("aria-label", "flip");
    
    let img = document.createElement("img");
    img.classList.add("img-fluid");
    img.src = TILEBACK;
    img.alt = TILEBACKALT;
    
    button.appendChild(img);
    tileDiv.appendChild(button);


    button.addEventListener("click", function(evt){
        evt.preventDefault();
        if (img.alt === TILEBACKALT) {
            img.src = tile.url;
            img.alt = tile.alt;
            if (lastTile.img == undefined) {
                lastTile.img = tile.url;
                lastTile.element = img;
            } else {
                if (lastTile.img == tile.url) {
                    stats.matches++;
                    stats.remaining--;
                    lastTile.img = undefined;
                    lastTile.element = undefined;
                    checkGameEnd(stats);
                } else {
                    stats.missed++;
                    setTimeout(function() {
                        img.src = TILEBACK;
                        img.alt = TILEBACKALT;
                        lastTile.element.src = TILEBACK;
                        lastTile.element.alt = TILEBACKALT;
                        lastTile.img = undefined;
                        lastTile.element = undefined;
                    }, 500);
                }
                renderStats(stats);
            }
        }
    });
    return tileDiv;
}

function renderStats(stats) {
    document.querySelector("#matches").textContent = stats.matches;
    document.querySelector("#missedMatches").textContent = stats.missed;
    document.querySelector("#remaining").textContent = stats.remaining;
}

function renderClock(clock) {
    let time = Date.now() - clock.startTime;
    let minutes = Math.floor(time / 60000);
    let seconds = Math.floor((time % 60000) / 1000);
    document.querySelector("#time").textContent = "" + minutes + " min " + seconds + " sec";
}

function checkGameEnd(stats) {
    console.log("checking game end");
    if (stats.matches == TILE_NUM && stats.remaining == 0) {
        clearInterval(clock.timer);
        let modal = document.querySelector("#win-modal");
        if (confirm("Congratulations! Play again?")) {
            newGame();
        }
    }
}

//start a new game when the page loads
newGame();

// document.addEventListener('keydown', function(evt) {
//     evt.preventDefault();
//     stats.matches = TILE_NUM;
//     stats.remaining = 0;
//     checkGameEnd(stats);
// });
