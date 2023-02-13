//finished first attempt TWO PLAYER
const tiles = document.querySelectorAll('.tile');   //array of all elements called tile

let board = ['','','','','','','','',''];       //game board
let currentPlayer='X';
let isGameActive=true;

let winners=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]   //winning lines array
winlen=winners.length;


function reset_board(){                 //reload the game if reset pressed 
    location.href='index.html';
}

function check_for_win(){                 //check board against winning lines and for tie
    let players = ['X','O'];

    for(let a=0;a<2;a++){               //for who in player
        for(let i=0;i<winlen;i++){      //for item in winners

            if(board[winners[i][0]]===players[a] && board[winners[i][1]]===players[a] && board[winners[i][2]]===players[a]){
                return(players[a])      //return who won
            }
        }
    }
    for(let i=0;i<9;i++){       //return nothing if still playing
        if (board[i]===''){
            return
        }
    }
    return("TIE")               //all thats left is tie
}

function pressed(){ //when board pressed
    if (isGameActive) {                                     //stops play after win or tie
        if (board[this.dataset.name]===''){ 
            this.innerText=currentPlayer;                   //text into board
            board[this.dataset.name]=currentPlayer;         //set board

            
            if (check_for_win()){                           //check for win or tie
                isGameActive=false;                         //stop game play if gameover
                if (check_for_win()==="TIE"){
                    document.querySelector('.announcer').innerText="TIE";
                }
                else{
                    document.querySelector('.announcer').innerText=check_for_win()+ " is the winner!";
                }
                document.querySelector('.announcer').classList.remove('hide');
            }

            if (currentPlayer==='X'){currentPlayer='O'} else {currentPlayer='X'};    //swap players
            document.querySelector('.display-player').innerText=currentPlayer;      //display whos turn
        }
    }
}

document.querySelector('#reset').addEventListener('click', reset_board);        //event listeners
tiles.forEach(tile => tile.addEventListener('click', pressed));
