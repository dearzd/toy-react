import ToyReact, { Component } from './src/toyReact';

// import React, { Component } from 'react';
// import ReactDOM from 'react-dom';

class Square extends Component {
  render() {
    console.log('-------------square render');
    return (
      <button className="square" onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends Component {
  renderSquare(i) {
    return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  renderBoardRow(row) {
    let squares = [];
    for (let col = 0; col < 3; col++) {
      squares.push(this.renderSquare(row * 3 + col));
    }
    return (
      <div key={row} className="board-view">{squares}</div>
    );
  }

  render() {
    console.log('-------------board render');
    let board = [];
    for (let row = 0; row < 3; row++) {
      board.push(this.renderBoardRow(row));
    }
    // document.addEventListener('click', () => console.log(board));

    return (
      <div className="board-container">
        {board}
      </div>
    );
  }
}

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      redundantForTest: 1
    };
  }

  handleClick(i) {
    const { stepNumber, xIsNext } = this.state;
    const history = this.state.history.slice(0, stepNumber + 1);
    const current = history[stepNumber];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat({
        squares: squares
      }),
      stepNumber: history.length,
      xIsNext: !xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    console.log('-------------game render');
    const { history, stepNumber, xIsNext} = this.state;
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);
    const status = winner ? (winner + ' is win!') : 'Next player: ' + (xIsNext ? 'X' : 'O');

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });console.log(moves);

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

ToyReact.render(<Game />, document.getElementById('root'));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}