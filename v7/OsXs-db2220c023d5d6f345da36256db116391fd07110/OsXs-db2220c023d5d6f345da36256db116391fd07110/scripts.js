//O's ans Xs
//added 0 players functionality
const tiles = document.querySelectorAll('.tile'); //array of all elements called tile

let board = ['','','','','','','','',''];       //game board
let currentPlayer='X';                      
let isGameActive=true;                  
no_ps = null;
mySound = new Audio("sounds/bounce.mp3"); 
winSound = new Audio("sounds/win.mp3");    
tieSound = new Audio("sounds/tie.mp3");  

function reset_board(){          //reload the game if reset pressed 
    location.href='index.html';
}

function check_for_win(){               //check board against winning lines and for tie
    let winners=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]] //winning lines array
    let players = ['X','O'];

    for(let a=0;a<2;a++){               //for who in player
        for(let i=0;i<winners.length;i++){      //for item in winners

            if(board[winners[i][0]]===players[a] && board[winners[i][1]]===players[a] && board[winners[i][2]]===players[a]){
                return(players[a]);      //return who won
            }
        }
    }
    for(let i=0;i<9;i++){               //return nothing if still playing
        if (board[i]===''){
            return;
        }
    }
    return("TIE");                      //all thats left is tie
}

function pressed(){             //when board pressed    
    if (isGameActive&&no_ps) {                              //stops play after win or tie, game will only start with a players select
        
        if (board[this.dataset.name]===''){                 //checks to see if board location empty
            mySound.play();
            this.innerText=currentPlayer;                   //text into board
            board[this.dataset.name]=currentPlayer;         //set board to player
     
            if (check_for_win()){ won(); }                  //check for win or tie

            if(no_ps===1){          //single player
                if(isGameActive){                               //check game is not over
                    let cturn=0;                                
                    cturn=comp_go('O','X');                            //computers turn
                    board[cturn]='O';
                    tiles[cturn].innerText='O';
                    
                    if(check_for_win()){ won(); }               //check for win or tie
                }
            }
            else{                    //2 player - swap the players
                if(currentPlayer==='X'){currentPlayer='O';}
                else{currentPlayer='X';}
            }
        if(isGameActive){
            document.querySelector('.display-player').innerText=currentPlayer;}// display who turn if not game over
        }
    }
}

function won(){                 //if game is won
    isGameActive=false;                         //stop game play if gameover
    if (check_for_win()==="TIE"){
        tieSound.play();
        document.querySelector('.announcer').innerText="TIE";
    }
    else{
        winSound.play();
        document.querySelector('.announcer').innerText=check_for_win()+ " is the winner!";
    }
    document.querySelector('.announcer').classList.remove('hide');
}

function comp_go(p1,p2){     //computers (O's) turn p1 computers current turn
   
    let move=0;             //move will be where the computer plays
    let best_score=-100000; //each move will be scored. The best will be chosen
    let score=-100000;      //to compare to best score

    for(let i=0;i<9;i++){   //try each move and get a score from minimax 

        if (board[i]===''){  //if empty space place tile
            board[i]=p1;
            score = miniMax(p1,p2,false);
            if(score>best_score){
                best_score=score;
                move=i;
            }
            board[i]='';    //return space to empty
        }
    }
    return move;            //returns the best move for p1
}

function noPlayers(){       //zero players
    let rand=(Math.floor(Math.random()*9)); //first turn random so not always the same
    board[rand]='X';
    tiles[rand].innerText='X';

    while (isGameActive){                               //check game is not over
        currentPlayer='O';           
        let cturn=0;                                
        cturn=comp_go('O','X');                         //computers turn as  O
        board[cturn]='O';
        tiles[cturn].innerText='O';
        
        if(check_for_win()){ won(); }      //check for win or tie
        
        if(isGameActive){                               //if game is not over
            currentPlayer='X';                          //computers turn as X
            let cturn=0;                                
            cturn=comp_go('X','O');                     //computers turn as X
            board[cturn]='X';
            tiles[cturn].innerText='X';
            
            if(check_for_win()){ won(); }   //check for win or tie
        }
    }
}

function miniMax(p1,p2,isMaximising){     // miniMax - here we alternate turns choosing the best move for each 
                        // player until a gameover state. the best move for the computer is returned
                        // the scoring is multiplied by the number of empty spaces on the board to 
                        // make sure we have the fasted route to a win
    let ans='';
    ans = check_for_win();  //if there is a winner or tie we do not need to continue, just score
    if (ans){               //scoring
        if (ans===p1){return 1*(no_zeros()+1)};
        if (ans===p2){return -1*(no_zeros()+1)};
        if (ans==='TIE'){return 0};
    }

    if (isMaximising){      //ismax is going for the highest score for computer
        let best_score=-100000;
        let score=-100000;

        for(let i=0;i<9;i++){
            if(board[i]===''){  //if space empty
                board[i]=p1;   //set to computer piece
                score=miniMax(p1,p2,false);   //get score sent from miniMax   
                board[i]='';    //return board to origioal state
                best_score=Math.max(score, best_score);
            }
        }
        return best_score;      //best score for computer
    }
    else{           //ismax false - lowest score returned for players best go
        let best_score=100000;
        let score=100000;
        for(let i=0;i<9;i++){
            if(board[i]===''){
                board[i]=p2;
                score=miniMax(p1,p2,true);
                board[i]='';
                best_score=Math.min(score, best_score);
            }
        }
        return best_score;      //best score for player
    }
}

function no_zeros(){    //this is to count unused board spaces for scoring. The more spaces with win
    let ans=0;          // the quicker the win so higher the score
    for(let i=0;i<9;i++){
        if(board[i]===''){ans++};
    }
    return ans;
}

function hide_o_or_t(){
    document.querySelector('.plays').classList.add('hide'); // hide player buttons
    if (this.dataset.name==="1p"){no_ps=1;} //set game for 1player
    if (this.dataset.name==="2p"){no_ps=2;} // set game for 2 player
    if (this.dataset.name==="0p"){noPlayers();} // send to 0 player function
}

document.querySelector('#reset').addEventListener('click', reset_board);    //check for reset click
document.querySelector('#p1').addEventListener('click', hide_o_or_t);
document.querySelector('#p2').addEventListener('click', hide_o_or_t);
document.querySelector('#p0').addEventListener('click', hide_o_or_t);         //0 players function
tiles.forEach(tile => tile.addEventListener('click', pressed));             //check for gameboard click