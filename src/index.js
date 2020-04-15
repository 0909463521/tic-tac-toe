import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Square extends React.Component {
    render() {
        return (
            <button className="square" onClick={() => { this.props.onClick() }} style={{ float: 'left', paddingRight: '5px', backgroundColor: this.props.thaydoimau }} >
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {

    renderSquare(i, j) {
        return (
            <Square
                value={this.props.squares[i][j]}
                onClick={() => this.props.onClick(i, j)}
                thaydoimau={this.props.mycolor[i][j]}

            />
        );
    }
    createTable = () => {
        let Parent = []

        for (let i = 0; i < 20; i++) {
            let children = []

            for (let j = 0; j < 20; j++) {
                children.push(this.renderSquare(i, j))

            }

            Parent.push(<div className="board-row">{children}</div>)

        }

        return Parent
    }

    render() {

        return (
            <div>
                {/* <div className="status">{status}</div> */}
                {this.createTable()}
            </div>
        );
    }
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{ squares: Array(20).fill(null).map(row => new Array(20).fill(null)) }],
            xIsNext: true,
            mycolor: Array(20).fill("white").map(row => new Array(20).fill("white")),
            checkpeace: 0,

            stepNumber: 0,

            isHistorySortAscending: true,
        };

    }
    handleClick(i, j) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.map((arr) => {
            return arr.slice();
        });//đây là cách copy mảng 2 chiều
        
        if (squares[i][j]) {
            return;
        }
        squares[i][j] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });

        // var checkfull= toCheckfull(this.state.squares)
        if (calculateWinner(squares, i, j, squares[i][j]) != null) {
            let tmpcolor = calculateWinner(squares, i, j, squares[i][j])
             this.state.mycolor = tmpcolor
        }

    }

    jumpTo(step) {


        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,

        });
    }
    toggleHistorySort()
    {
        this.state.isHistorySortAscending = !this.state.isHistorySortAscending
        this.setState(this.state)
    }
    render() {
        const {mycolor,xIsNext,history,isHistorySortAscending}=this.state
        
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice()
        
        
        const historyMoves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        let moves=historyMoves
        if(!isHistorySortAscending)
            moves=historyMoves.reverse()


        let status;
        status = "Next player: " + (xIsNext ? "X" : "O");

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={squares}
                        onClick={(i, j) => this.handleClick(i, j)}
                        mycolor={mycolor}
                    />
                </div>
                <div className="game-info">
                    
                    <div>{ status }</div>
                    <button onClick={()=>{this.toggleHistorySort()}}>{isHistorySortAscending===true? "Tăng Dần" : "Giảm Dần" }</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}





function checkWin(currentsquare, arr) {
    let current = 0;
    for (let i = 0; i <= (arr.length - 5); i++) {
        let dem = 0
        current = i
        for (let j = i; j <= i + 4; j++) {


            if (arr[j] === currentsquare) {
                dem++
            }
            if (dem === 5) {

                return current;


            }
        }


    }
    return null
}
function laymangNgang(square, row, col, currentsquare) {
    let arrN = []

    let tmpcolor = Array(20).fill("white").map(row => new Array(20).fill("white"));

    let diemdau;

    for (let i = ((col - 4 < 0) ? 0 : (col - 4)); i <= ((col + 4 > 19) ? 19 : (col + 4)); i++) {

        arrN.push(square[row][i]);
    }
    if (checkWin(currentsquare, arrN) != null) {
        let myindex = checkWin(currentsquare, arrN)

        if (col - 4 < 0) {
            diemdau = 0
        }
        else {
            diemdau = col - 4
        }
        diemdau = diemdau + myindex

        for (let i = 0; i < 5; i++) {
            tmpcolor[row][diemdau] = "red"
            diemdau = diemdau + 1
        }

        return tmpcolor;
    }
    else {
        return null;
    }

}
function laymangDoc(square, row, col, currentsquare) {
    let arrN = []

    let tmpcolor = Array(20).fill("white").map(row => new Array(20).fill("white"));

    let diemdau;

    for (let i = ((row - 4 < 0) ? 0 : (row - 4)); i <= ((row + 4 > 19) ? 19 : (row + 4)); i++) {
        arrN.push(square[i][col]);
    }
    if (checkWin(currentsquare, arrN) != null) {
        let myindex = checkWin(currentsquare, arrN)

        if (row - 4 < 0) {
            diemdau = 0
        }
        else {
            diemdau = row - 4
        }
        diemdau = diemdau + myindex

        for (let i = 0; i < 5; i++) {
            tmpcolor[diemdau][col] = "red"
            diemdau = diemdau + 1
        }

        return tmpcolor;
    }
    else {
        return null;
    }

}

function laymangCheotrai(square, row, col, currentsquare) {
    let dem = 1;
    let arrCheoTrai = [];
    let originalrow = row;
    let originalcol = col;
    let tmpcolor = Array(20).fill("white").map(row => new Array(20).fill("white"));




    arrCheoTrai.push(square[row][col])
    for (let i = 0; i < 4; i++) {
        if (row === 0) {

            break;
        }
        if (col === 0) {

            break;
        }

        row = row - 1
        col = col - 1
        arrCheoTrai.push(square[row][col])
    }
    arrCheoTrai.reverse()

    for (let j = 0; j < 4; j++) {
        if (originalrow >= 20 - 1) {

            break;
        }
        if (originalcol >= 20 - 1) {

            break;
        }

        originalrow = originalrow + 1
        originalcol = originalcol + 1
        arrCheoTrai.push(square[originalrow][originalcol])
    }
    console.log("cheo Trai" + arrCheoTrai)


    if (checkWin(currentsquare, arrCheoTrai) != null) {
        let myindex = checkWin(currentsquare, arrCheoTrai)

        row = row + myindex
        col = col + myindex



        for (let i = 0; i < 5; i++) {
            tmpcolor[row][col] = "red"
            row = row + 1
            col = col + 1
        }

        return tmpcolor;
    }
    else {
        return null;
    }

}

function laymangCheophai(square, row, col, currentsquare) {
    let dem = 1;
    let arrCheoPhai = [];
    let originalrow = row;
    let originalcol = col;
    let tmpcolor = Array(20).fill("white").map(row => new Array(20).fill("white"));

    arrCheoPhai.push(square[row][col])
    for (let i = 0; i < 4; i++) {
        if (row === 0) {

            break;
        }
        if (col >= 20 - 1) {

            break;
        }
        dem = dem + 1
        row = row - 1
        col = col + 1
        arrCheoPhai.push(square[row][col])
    }
    arrCheoPhai.reverse()

    for (let j = 0; j < 4; j++) {
        if (originalrow >= 20 - 1) {

            break;
        }
        if (originalcol === 0) {

            break;
        }
        dem = dem + 1
        originalrow = originalrow + 1
        originalcol = originalcol - 1
        arrCheoPhai.push(square[originalrow][originalcol])
    }
    console.log("cheo phai: " + arrCheoPhai)

    if (checkWin(currentsquare, arrCheoPhai) != null) {
        let myindex = checkWin(currentsquare, arrCheoPhai)

        row = row + myindex
        col = col - myindex



        for (let i = 0; i < 5; i++) {
            tmpcolor[row][col] = "red"
            row = row + 1
            col = col - 1
        }

        return tmpcolor;
    }
    else {
        return null;
    }



}


function calculateWinner(squares, row, col, currentsquare) {
    let tmpcolor = Array(20).fill("white").map(row => new Array(20).fill("white"));

    if (laymangNgang(squares, row, col, currentsquare) != null) {
        tmpcolor = (laymangNgang(squares, row, col, currentsquare))

        return tmpcolor
    }
    if (laymangDoc(squares, row, col, currentsquare) != null) {
        tmpcolor = (laymangDoc(squares, row, col, currentsquare))

        return tmpcolor
    }
    if (laymangCheotrai(squares, row, col, currentsquare) != null) {
        tmpcolor = (laymangCheotrai(squares, row, col, currentsquare))

        return tmpcolor
    }
    if (laymangCheophai(squares, row, col, currentsquare) != null) {
        tmpcolor = (laymangCheophai(squares, row, col, currentsquare))

        return tmpcolor
    }
    // if(laymangDoc(squares,row,col,currentsquare)===true)
    // {
    //     return true;
    // }
    // if(laymangCheotrai(squares,row,col,currentsquare)===true)
    // {
    //     return true;
    // }
    // if(laymangCheophai(squares,row,col,currentsquare)===true)
    // {
    //     return true;
    // }
    return null;

}

function toCheckfull(mang) {
    if (mang.length === 9) {
        for (let tmp = 0; tmp < mang.length; tmp++) {
            if (mang[tmp] == null) {
                return false;
            }
        }
        return true; // tất cả đều được diền hết 
    }

    return false
}



// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
