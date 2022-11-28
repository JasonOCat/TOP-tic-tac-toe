const playerFactory = function(name, mark) {

    const getName = () => name;
    const getMark = () => mark;
    const setName = (inputName) => name = inputName;

    const placeMark = (x, y) => {
        gameBoard.addMark(x, y, mark);
    }

    return {
        getName,
        getMark,
        placeMark,
        setName,
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

    /* Game players */
    const _player1 = playerFactory("Player 1", "X");
    const _player2 = playerFactory("Player 2", "0");
    const _computer = playerFactory("Computer", "0");
    
    let _currentPlayer;
    let pauseGame = true;
    let isVsPlayerMode;

    /* elements */ 
    const startButton = document.body.querySelector('.btn-start');
    const btnMode = document.body.querySelector('.btn-mode');
    const btnChangeMode = document.body.querySelector('.btn-change-mode');
    const btnReset = document.body.querySelector('.btn-reset');
    const btnPlayAgain = document.body.querySelector('.btn-play-again');
    const formNames = document.body.querySelector('.form-names');

    const paraPlayer1 = document.body.querySelector('.p-player1');
    const paraPlayer2 = document.body.querySelector('.p-player2');

    const vsPlayer = document.body.querySelector('.vs-player');
    const vsComputer = document.body.querySelector('.vs-computer');
    const roundDiv = document.body.querySelector('.round');

    /* listeners */



    const _startGame = () => {
        btnMode.style.visibility = "visible";
        startButton.style.display = "none";
    };

    const _chooseMode = (e) => {
        if (e.target.classList.contains('vs-player')) {
            formNames.style.visibility = "visible"
            isVsPlayerMode = true;

        } else {
            isVsPlayerMode = false;
        }
        
    }

    const _setNames = (e) => {
        e.preventDefault();
        _player1.setName(formNames.elements["player1"].value);
        _player2.setName(formNames.elements["player2"].value);
        paraPlayer1.textContent = _player1.getName();
        paraPlayer2.textContent = _player2.getName();
    }

    const _changeMode = () => {
        gameBoard.resetBoard();
        pauseGame = true;
        btnMode.style.visibility = "visible";
        btnReset.style.visibility = "hidden";
        btnChangeMode.style.visibility = "hidden";
        roundDiv.textContent = "";
    }

    const _resetGame = () => {
        _currentPlayer = _player1;
        gameBoard.resetBoard();
        btnPlayAgain.style.display = "none";
        if (isVsPlayerMode) {
            roundDiv.textContent = `${_currentPlayer.getName()}'s turn (${_currentPlayer.getMark()})`
        } else {
            roundDiv.textContent = 'Your Turn';
        }
        
        pauseGame = false;
    }

    startButton.addEventListener('click', _startGame);
    vsPlayer.addEventListener('click', (e) => {
        _chooseMode(e);
        btnMode.style.visibility = "hidden";
        
    });
    vsComputer.addEventListener('click', (e) => {
        _chooseMode(e);
        btnMode.style.visibility = "hidden";
        _player1.setName("You");
        paraPlayer1.textContent = _player1.getName();
        paraPlayer2.textContent = _computer.getName();
        _currentPlayer = _player1;
        btnChangeMode.style.visibility ="visible"
        btnReset.style.visibility = "visible";
        pauseGame = false;
    });

    btnChangeMode.addEventListener('click', _changeMode);
    btnReset.addEventListener('click', _resetGame);
    btnPlayAgain.addEventListener('click', _resetGame);

    formNames.addEventListener('submit', (e) => {
        _setNames(e);
        _currentPlayer = _player1;
        roundDiv.textContent = `${_currentPlayer.getName()}'s turn (${_currentPlayer.getMark()})`
        e.target.style.visibility = "hidden";
        btnChangeMode.style.visibility ="visible"
        btnReset.style.visibility = "visible";
        pauseGame = false;
    });
    


    let _grids = document.querySelectorAll('.grid');

    const playRound = (x, y) => {
        if (pauseGame) {
            return;
        }

        if (_currentPlayer !== _computer && gameBoard.getGrid()[x][y] !== '') { //cell is already filled, do nothing
            return;
        }

        if (_currentPlayer === _computer) { // computer plays again if the random grid is already filled
            let rand1;
            let rand2;
            do {
                rand1 = Math.floor(Math.random() * (3));
                rand2 = Math.floor(Math.random() * (3));
            }
            while (gameBoard.getGrid()[rand1][rand2] !== '');
            _currentPlayer.placeMark(rand1, rand2);     
        } else {
            _currentPlayer.placeMark(x, y);
        }
       
        
        if (gameBoard.isWinner(_currentPlayer.getMark())) {
            _displayWinner();
            pauseGame = true;
            btnPlayAgain.style.display = "inline";
            return;
        }

        else if (isDraw(gameBoard.getGrid())) {
            _displayDraw();
            pauseGame = true;
            btnPlayAgain.style.display = "inline";
            return;
        }

        if (isVsPlayerMode) {
            _currentPlayer = _currentPlayer === _player1 ? _player2 : _player1;
            roundDiv.textContent = `${_currentPlayer.getName()}'s turn (${_currentPlayer.getMark()})`;
        } else {
            _currentPlayer = _currentPlayer === _player1 ? _computer : _player1;
            roundDiv.textContent = 'Your Turn';
            let random1 = Math.floor(Math.random() * (3));
            let random2 = Math.floor(Math.random() * (3));
            if (_currentPlayer === _computer) {
                playRound(random1, random2);
            }
        }
        
        
    }

    const _displayWinner = () => {

        if (isVsPlayerMode) {
            roundDiv.textContent = `${_currentPlayer.getName()} won 🎉 !`
        }
        else if (_currentPlayer === _computer) {
            roundDiv.textContent =  'Computer Won 🤖 !'
        } else {
            roundDiv.textContent = 'You won 🎉'
        }
        
    };

    const _displayDraw = () => {
        roundDiv.textContent = `Draw !`
    };

    _grids.forEach(grid => grid.addEventListener('click', (e) => {
        let x = e.target.getAttribute('data-x');
        let y = e.target.getAttribute('data-y');
        playRound(x, y);
    }));

    const isDraw = (grid) => {
        return grid
            .flatMap(mark => mark)
            .every(mark => mark !== "");
    }

    return {
        isDraw,
    };

})();




