const playerFactory = function(name, mark) {

    const getName = () => name;
    const getMark = () => mark;

    const placeMark = (x, y) => {
        gameBoard.addMark(x, y, mark);
    }

    return {
        getName,
        getMark,
        placeMark,
    };
}

const gameBoard = (() => {
    let _grid = [['','',''],['','',''],['','','']];
    const grids = document.body.querySelectorAll('.grid');

    const getGrid = () => _grid;

    const addMark = (x, y, mark) => {
        _grid[x][y] = mark;
        _addMarkDOM(x, y, mark);
        console.table(_grid);
    }

    const _addMarkDOM = (x, y, mark) => {
        const gridDOM = document.body.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        gridDOM.textContent = mark;
    }

    const isWinner = (mark) => {
        return (
            (_grid[0][0] === mark && _grid[0][1] === mark && _grid[0][2] === mark) // 3 in a row horizontaly
            || (_grid[1][0] === mark && _grid[1][1] === mark && _grid[1][2] === mark)
            || (_grid[2][0] === mark && _grid[2][1] === mark && _grid[2][2] === mark)
            || (_grid[0][0] === mark && _grid[1][0] === mark && _grid[2][0] === mark) // 3 in a row verticaly
            || (_grid[0][1] === mark && _grid[1][1] === mark && _grid[2][1] === mark)
            || (_grid[0][2] === mark && _grid[1][2] === mark && _grid[2][2] === mark)
            || (_grid[0][0] === mark && _grid[1][1] === mark && _grid[2][2] === mark) // 3 in a row diagonals
            || (_grid[2][0] === mark && _grid[1][1] === mark && _grid[0][2] === mark)
        )
    };

    const resetBoard = () => {
        _grid = [['','',''],['','',''],['','','']];
        grids.forEach(_grid => _grid.textContent = "");
    }

    return {
        getGrid,
        resetBoard,
        addMark,
        isWinner,
    };
})();

const gameController = (() => {
    let pauseGame = false;
    const _player1 = playerFactory("Player 1", "X");
    const _player2 = playerFactory("Player 2", "0");
    const roundDiv = document.body.querySelector('.round');
    let _currentPlayer = _player1;
    let _grids = document.querySelectorAll('.grid');

    const playRound = (e) => {
        if (pauseGame) {
            return;
        }
        let x = e.target.getAttribute('data-x');
        let y = e.target.getAttribute('data-y');

        if (gameBoard.getGrid()[x][y] !== '') { //cell is already filled, do nothing
            return;
        }
       
        _currentPlayer.placeMark(x, y);
        if (gameBoard.isWinner(_currentPlayer.getMark())) {
            _displayWinner();
            pauseGame = true;
            return;
        }

        else if (isDraw(gameBoard.getGrid())) {
            _displayDraw();
            pauseGame = true;
            return;
        }
        _currentPlayer = _currentPlayer === _player1 ? _player2 : _player1;
        roundDiv.textContent = `Au tour de ${_currentPlayer.getName()} (${_currentPlayer.getMark()}) de jouer`;
    }

    const _displayWinner = () => {
        roundDiv.textContent = `${_currentPlayer.getName()} won !`
    };

    const _displayDraw = () => {
        roundDiv.textContent = `Draw !`
    };

    _grids.forEach(grid => grid.addEventListener('click', playRound));

    const isDraw = (grid) => {
        return grid
            .flatMap(mark => mark)
            .every(mark => mark !== "");
    }

    return {
        isDraw,
    };

})();




