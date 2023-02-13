//single player
const tiles = document.querySelectorAll('.tile'); //array of all elements called tile

let board = ['','','','','','','','',''];       //game board
let currentPlayer='X';                      
let isGameActive=true;                      

let winners=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]] //winning lines array
winlen=winners.length;                  

function reset_board(){          //reload the game if reset pressed 
    location.href='index.html';
}

function check_for_win(){               //check board against winning lines and for tie
    let players = ['X','O'];

    for(let a=0;a<2;a++){               //for who in player
        for(let i=0;i<winlen;i++){      //for item in winners

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
    if (isGameActive) {                                     //stops play after win or tie
        if (board[this.dataset.name]===''){                 //checks to see if board location empty
            this.innerText=currentPlayer;                   //text into board
            board[this.dataset.name]=currentPlayer;         //set board to player
     
            if (check_for_win()){ won(); }                  //check for win or tie
                
            if(isGameActive){                               //check game is not over
                let cturn=0;                                
                cturn=comp_go();                            //computers turn
                board[cturn]='O';
                tiles[cturn].innerText='O';
                
                if(check_for_win()){ won(); }               //check for win or tie
            }
        }
    }
}

function won(){                 //if game is won
    isGameActive=false;                         //stop game play if gameover
    if (check_for_win()==="TIE"){
        document.querySelector('.announcer').innerText="TIE";
    }
    else{
        document.querySelector('.announcer').innerText=check_for_win()+ " is the winner!";
    }
    document.querySelector('.announcer').classList.remove('hide');
}

function comp_go(){     //computers (O's) turn
   
    let move=0;             //move will be where the computer plays
    let best_score=-100000; //each move will be scored. The best will be chosen
    let score=-100000;      //to compare to best score

    for(let i=0;i<9;i++){   //try each move and get a score from minimax 

        if (board[i]===''){  //if empty space place tile
            board[i]="O";
            score = miniMax(false);
            if(score>best_score){       //make sure best score and move is saved
                best_score=score;
                move=i;
            }
            board[i]='';    //return space to empty
        }
    }
    return move;            //returns the best move
}

function miniMax(isMaximising){     // miniMax - here we alternate turns choosing the best move for each 
                        // player until a gameover state. the best move for the computer is returned
                        // the scoring is multiplied by the number of empty spaces on the board to 
                        // make sure we have the fasted route to a win
    let ans='';
    ans = check_for_win();  //if there is a winner or tie we do not need to continue, just score
    if (ans){               //scoring
        if (ans==='O'){return 1*(no_zeros()+1)};
        if (ans==='X'){return -1*(no_zeros()+1)};
        if (ans==='TIE'){return 0};
    }

    if (isMaximising){      //ismax is going for the highest score for computer
        let best_score=-100000;
        let score=-100000;

        for(let i=0;i<9;i++){
            if(board[i]===''){  //if space empty
                board[i]='O';   //set to computer piece
                score=miniMax(false);   //get score sent from miniMax   
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
                board[i]='X';
                score=miniMax(true);
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

document.querySelector('#reset').addEventListener('click', reset_board);    //check for reset click
tiles.forEach(tile => tile.addEventListener('click', pressed));             //check for gameboard click