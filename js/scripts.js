"use strict";

//create 2 modules, one for gameBoard, and another for displayController

const GameBoard  = (()=>{
    let playStatus = false;
    let humanTurn = true;
    let board = [];
    const fields = document.querySelectorAll(".field");
    
    const _addEventListener =() =>{
        //creating event listener for board fields
        fields.forEach((el)=>{
            el.addEventListener("click", (e)=>{
                //if empty update field and board array
                if(e.target.textContent == "" && playStatus == true){
                    board[e.target.id] = human.getChoice();
                    //updating board array
                    _updateBoard();
                    //ending human turn
                    humanTurn = false;
                    _checkWinner();
                }
                
            })
        })
    }
    const getPlayStatus = () => playStatus;
    const setPlayStatus = (status) =>{playStatus = status}
    const clearBoard = () =>{
        board = ["", "", "",
                "", "", "",
                "", "", ""];
        fields.forEach((el, index)=>{
            el.textContent = board[index];
        })
        humanTurn = true;
    }
    const _updateBoard = () =>{
        fields.forEach((el)=>{
            if(board[el.id] != ""){
                el.textContent = board[el.id];
            }
        })
    }
    const _computerPlay = () =>{

        let emptyFields = []

        board.forEach((el, index) =>{
            if(el == ""){
                emptyFields.push(index);
            }
        })

        let randomIndex = Math.floor(Math.random()*emptyFields.length);
        board[emptyFields[randomIndex]] = computer.getChoice();

        _updateBoard();
        //ending computer turn
        humanTurn = true;
        _checkWinner();
    }
    const _checkWinner = () =>{
        if(playStatus && board[0] != "" && board[0] == board[1] && board[1] == board[2]){
            //checking top row
            console.table(board)
            setPlayStatus(false);
            DisplayController.showWinner(board[0] == human.getChoice() ? human: computer);

        }else if(playStatus && board[0] != "" && board[0] == board[3] && board[3] == board[6]){
            //checking left column
            setPlayStatus(false);
            DisplayController.showWinner(board[0] == human.getChoice() ? human: computer);

        }else if(playStatus && board[0] != "" && board[0] == board[4] && board[4] == board[7]){
            //checking across
            setPlayStatus(false);
            DisplayController.showWinner(board[0] == human.getChoice() ? human: computer);

        }else if(playStatus && board[6] != "" && board[6] == board[4] && board[4] == board[2]){
            //checking other across
            setPlayStatus(false);
            DisplayController.showWinner(board[6] == human.getChoice() ? human: computer);

        }else if(playStatus && board[3] != "" && board[3] == board[4] && board[4] == board[5]){
            //checking center row
            setPlayStatus(false);
            DisplayController.showWinner(board[3] == human.getChoice() ? human: computer);

        }else if(playStatus && board[6] != "" && board[6] == board[7] && board[7] == board[8]){
            //cheking bottom row
            setPlayStatus(false);
            DisplayController.showWinner(board[6] == human.getChoice() ? human: computer);

        }else if(playStatus && board[1] != "" && board[1] == board[4] && board[4] == board[7]){
            //checking center column
            setPlayStatus(false);
            DisplayController.showWinner(board[1] == human.getChoice() ? human: computer);

        }else if(playStatus && board[2] != "" && board[2] == board[5] && board[5] == board[8]){
            //checking right column
            setPlayStatus(false);
            DisplayController.showWinner(board[2] == human.getChoice() ? human: computer);

        }else if(!humanTurn){
            _computerPlay();
        }
    }

    _addEventListener();
    return{getPlayStatus, setPlayStatus, clearBoard}

})();

//Module for controlling the DOM
const DisplayController  = (()=>{
    const popUp = document.querySelector("#pop-up");
    const playXButton = document.querySelector("#X");
    const playOButton = document.querySelector("#O");
    const restartButton = document.querySelector("#restart");

    //set popup to visible
    let _showPopUp = ()=>{
        popUp.style.visibility = "visible";
        popUp.style.opacity = 1;
        
    }
    let _hidePopUp = ()=>{
        popUp.style.visibility = "hidden";
        popUp.style.opacity = 0;
    }

    //create 3 listeners of the display restart button, and choicepicker
    let createEventListeners =()=>{
        //only does something if the game is not playing
        playXButton.addEventListener("click", (e)=>{
            if(!GameBoard.getPlayStatus()){
                //changes choice for our players
                human.setChoice("X");
                computer.setChoice("O");
                //updates class so the new choice has a green color
                playXButton.classList.add("playerChoice")
                playOButton.classList.remove("playerChoice");

            }
        })
        
        playOButton.addEventListener("click", (e)=>{
            if(!GameBoard.getPlayStatus()){
                human.setChoice("O");
                computer.setChoice("X");
                playOButton.classList.add("playerChoice")
                playXButton.classList.remove("playerChoice");
            }
        })

        //clearsBoard, sets play status to true, and makes choicePicker "unclickable"
        restartButton.addEventListener("click", (e)=>{
            e.target.textContent = "RESTART"
            _hidePopUp();
            GameBoard.clearBoard();
            GameBoard.setPlayStatus(true);
            playXButton.classList.remove("hover-control");
            playOButton.classList.remove("hover-control");
        })

    }

    let showWinner = (winner) =>{
        _showPopUp();
        winner.addCounter();
        playXButton.classList.add("hover-control");
        playOButton.classList.add("hover-control");

        popUp.innerHTML = `Player ${winner.getPlayer()} has won! \
                            Current score is:\
                            Human: ${human.getCounter()} vs Computer: ${computer.getCounter()}`;

    }

    return {createEventListeners, showWinner}
})();



//Factory function for players and computer

const Player = (human) =>{
    //human param is boolean, false for computers, stored in closure
    let counter = 0;
    //setting default choices
    let choice = "X";
    if(!human){
        choice = "O"
    }
    let player = human;
    const setChoice = (newChoice) =>{ choice = newChoice};
    const getChoice = () => {return choice};
    const addCounter = () => {counter++};
    const getCounter = () => {return counter};
    const getPlayer = () => player ?  "Human" : "Computer";

    return {setChoice, getChoice, addCounter, getCounter, getPlayer}
}

const human = Player(true);
const computer = Player(false);

DisplayController.createEventListeners();