/*
File: script.js
GUI Assignment: Scrabble Game
Arth Patel, UMass Lowell Computer Science,Arth_patel@student.uml.edu

This file is using javascript to make a scrabble game by 
dragging and dropping letter and also counting the user score,
after every word user needs to click submit to get new letters
and move the current score to Total score

Copyright (c) 2022 by Arth. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by AAP on June 29, 2022 at 4:00PM
*/

let letters = `{"pieces": [
	{"letter":"A", "value":1,  "distribution":9},
	{"letter":"B", "value":3,  "distribution":2},
	{"letter":"C", "value":3,  "distribution":2},
	{"letter":"D", "value":2,  "distribution":4},
	{"letter":"E", "value":1,  "distribution":12},
	{"letter":"F", "value":4,  "distribution":2},
	{"letter":"G", "value":2,  "distribution":3},
	{"letter":"H", "value":4,  "distribution":2},
	{"letter":"I", "value":1,  "distribution":9},
	{"letter":"J", "value":8,  "distribution":1},
	{"letter":"K", "value":5,  "distribution":1},
	{"letter":"L", "value":1,  "distribution":4},
	{"letter":"M", "value":3,  "distribution":2},
	{"letter":"N", "value":1,  "distribution":6},
	{"letter":"O", "value":1,  "distribution":8},
	{"letter":"P", "value":3,  "distribution":2},
	{"letter":"Q", "value":10, "distribution":1},
	{"letter":"R", "value":1,  "distribution":6},
	{"letter":"S", "value":1,  "distribution":4},
	{"letter":"T", "value":1,  "distribution":6},
	{"letter":"U", "value":1,  "distribution":4},
	{"letter":"V", "value":4,  "distribution":2},
	{"letter":"W", "value":4,  "distribution":2},
	{"letter":"X", "value":8,  "distribution":1},
	{"letter":"Y", "value":4,  "distribution":2},
	{"letter":"Z", "value":10, "distribution":1}
  ]
}`

const newLetters = JSON.parse(letters)
let lettersArr = [];
for(let i = 0; i < newLetters.pieces.length; i++){
  for(let j = 0; j < newLetters.pieces[i].distribution; j++)
    //push letter to array by distribution
    lettersArr.push(`imgs/${newLetters.pieces[i].letter.toLowerCase()}.jpg`)
}

// GLOBAL VARIABLES
let currImgSrc = "";
let imgSrcValue = "a";
let parent;
let siblings = false;
let previous, next;
let dropped = true;
let draggedOver = false;
let userScore = 0;

//getting the values by query selector
const score = document.querySelector(".score")
const rackBox = document.querySelectorAll(".rack > .empty")
const clearBoardTiles = document.querySelectorAll(".dropBox")

// keep getting the updated values
setInterval(() => {
  let fill = document.querySelectorAll(".fill");
  fill.forEach(currImg => {
    currImg.addEventListener("dragstart", dragStart);
    currImg.addEventListener("dragend", dragEnd);
  });

  const empty = document.querySelectorAll(".empty");
  empty.forEach(emptyBox => {
    emptyBox.addEventListener("dragover", dragOver);
    emptyBox.addEventListener("dragleave", dragLeave);
    emptyBox.addEventListener("drop", dragDrop);
  });

}, 100);

// checks when the user drags the img
function dragStart(){
  currImgSrc = this.children[0].src
  parent = this.parentElement
  setTimeout(()=> (parent.textContent = ""), 0);
}



//checks when the image is on the box
function dragOver(e){
  e.preventDefault();
  draggedOver = true;
}

// checks when img leaves the box
function dragLeave(){
  draggedOver = false;
}

// checks when user let go the img
function dragEnd(){
  this.classList.add("fill")
  if(dropped == false || draggedOver == false){
    if(parent.classList.contains("dropBox"))
      errorLog("errUnDraggable")
    else
      errorLog("errInvalid")
    newImgMaker(parent)
  }
}

// checks when img is dropped in the box
function dragDrop(){
  const checkSib = document.querySelectorAll(".dropBox")
  siblings = [...checkSib].some(getSiblings)

  if(!this.classList.contains("first")
    && this.classList.contains("dropBox"))
        previous = this.previousSibling.previousSibling.childNodes.length;
 
  if(!this.classList.contains("last")
   && this.classList.contains("dropBox"))
        next = this.nextSibling.nextSibling.childNodes.length;
  
    Validate_Tile(this)
}

// checks if siblings exist for the game board 
function getSiblings(elem){
  if(elem.childNodes.length == 1)
    return true;
  return false;
} 

// its going to move score to total score and give new letters to user
const submit_Word = document.querySelector(".Submit_Word")
const totalScore = document.querySelector(".totalScore")
let userScoreT = 0;
submit_Word.addEventListener("click", ()=>{
  userScoreT = userScoreT + userScore
  totalScore.textContent = userScoreT
  New_Letters()
  clearErrorLog();
})

New_Letters()

// gives random letter every time page reloads or submit button pressed
function New_Letters(){

  rackBox.forEach(box => {
    const index = Math.floor(Math.random() * lettersArr.length)
    const randIndexValue = lettersArr[index]

    // add img on the rack 
    if(box.children[0] == undefined && randIndexValue != undefined && !(lettersArr.length <= 0)){
      newImgMaker(box, randIndexValue)
      lettersArr.splice(index, 1);
      document.querySelector(".remainingLetters").textContent = lettersArr.length;
    } 
    
    // checks if the game is ended
    const endGame = [...rackBox].some(checkEndGame)
    if(randIndexValue == undefined && lettersArr.length <= 0 && endGame == false)
      errorLog("errGameOver")

  });

  // clear the board if user submits the word
  clearBoardTiles.forEach(element => {
    if(element.childElementCount >= 0){
      element.innerHTML = ""
      userScore = 0;
      score.innerHTML = userScore
    }
  });
}

// checks if the game is done
function checkEndGame(elem){
  if(elem.childElementCount == 1){
    return true;
  }
  return false;
}

// moves the image
function newImgMaker(box, img = currImgSrc){

  // every time the block is moved, it makes a new img and deletes the old one
  const newDiv = document.createElement("div")
  const newImg = document.createElement("img")
  
  newDiv.classList.add("fill")
  newDiv.setAttribute('draggable', true);
  newImg.src = img;
  newDiv.append(newImg)
  box.append(newDiv)
}

// this will update the user score
function updateUserScore(letter, element){

  for(let i = 0; i < newLetters.pieces.length; i++){
    if(newLetters.pieces[i].letter === letter.toUpperCase()){
        // if the tile has not been moved from original spot, then dont add score
        if(element == parent)
             return;

        // if the selected letter is placed on doubleScore, then score is doubled
        if(element.classList.contains("doubleScore"))
            userScore = userScore + (newLetters.pieces[i].value * 2);

        //if the selected letter is double word then whole word doubles
        else if(element.classList.contains("doubleWord"))
            userScore = userScore * 2 + (newLetters.pieces[i].value * 2);

        // else if its just a regular box, then only add the original value
        else if(!element.classList.contains("doubleScore")
        && element.classList.contains("dropBox"))
            userScore = userScore + newLetters.pieces[i].value;

      score.textContent = userScore;
    }
  }
}

function Validate_Tile(elem){

    // if img already exists then dont add and move it back to the original spot
    if(elem.childNodes.length >= 1 && draggedOver === true ){
      dropped = false;
      draggedOver = false;
      errorLog("errTileExists")
      return;
    }

    //if the tile is up there, it cant be moved
    if(parent.classList.contains("undraggable")){
      dropped = false;
      draggedOver = false;
      errorLog("errUnDraggable")
      return;
    }
  
    // check if the dropped box is the same box
    if(elem.classList.contains("dropBox") && (previous == 1 || next == 1 || siblings == false)){
      clearErrorLog()
      newImgMaker(elem);
      elem.classList.add("undraggable")
      siblings == true
      imgSrcValue = currImgSrc.substring(currImgSrc.indexOf("imgs/") + 5, currImgSrc.indexOf(".jpg"));
      updateUserScore(imgSrcValue, elem)
    } 
  
    // if the user moves the tiles in the rack
    else if(elem.classList.contains("rackLetters"))
      newImgMaker(elem);
  
    //reset
    else{
      dropped = false;
      draggedOver = false;
      newImgMaker(parent);
      errorLog("errNoSiblings")
    }

    dropped = true;
    draggedOver = true;
  }

// logs the errors
const err = document.querySelector("#err");

function errorLog(errType = "errDefault"){
  const errDefault = "There was an error moving the tile."
  const errUnDraggable = "The tile can't be moved once placed on the board. Please submit the word to clear the board."
  const errNoSiblings = "The tile couldn't be placed. The letter needs to be next to an existing tiles."
  const errParentSiblings = "The tile can't be moved from the middle of the tiles. Please move the words next to it first."
  const errInvalid = "The tile couldn't move successfully. Please place the tiles in the correct place."
  const errTileExists = "The block already contains a tile. Please place the tile in an empty block."
  const errNoRestock = "Can not restock the hand if board still has tiles, please submit the current word before stocking."
  const errGameOver = "Game over! You are out of tiles. Please reset the game to continue  playing."

  clearErrorLog();
  switch(errType){
    case "errUnDraggable":
      err.textContent = errUnDraggable;
      break;
    case "errNoSiblings":
      err.textContent = errNoSiblings;
      break;
    case "errParentSiblings":
      err.textContent = errParentSiblings;
      break;
    case "errTileExists":
      err.textContent = errTileExists;
      break;
    case "errNoRestock":
      err.textContent = errNoRestock;
      break;
    case "errGameOver":
      err.textContent = errGameOver;
      break;
    case "errInvalid":
      err.textContent = errInvalid;
      break;
    case "errDefault":
      err.textContent = errDefault;
      break;
  }
  err.style.padding = "20px";
}

// clears the error log
function clearErrorLog(){
  err.style.padding = "0";
  err.innerHTML = ""
}

// this will restart the game when button is pressed
document.querySelector(".restart").addEventListener("click", () => location.reload());
