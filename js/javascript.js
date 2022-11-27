const gameBoard = (() => {
    const gameBoard = [["1","2","3"],["4","5","6"],["7","8","9"]];
    const getGameBoard = () => gameBoard;



    return {
        getGameBoard,
    };
})();


const displayController = (() => {

})();


const playerFactory = function(name, mark) {
    const getName = () => name;
    const getMark = () => mark;
    return {getName, getMark};
}


gameBoard.getGameBoard().flatMap(x => x).forEach(x => console.log(x));