const HIGHSCORE_TABLE = document.getElementById("results");
const CLEAR_HIGHSCORE_BTN = document.getElementById("clear-button");


CLEAR_HIGHSCORE_BTN.addEventListener('click', clearHighscores);


generateHighscoresTable();

function generateHighscoresTable() {
  let highscores = localStorage.getItem("scoreList");
  if (highscores) {
    addHighscoreTableRows(highscores);
  } 
}


function addHighscoreTableRows(highscores) {
  highscores = JSON.parse(highscores);

  highscores.forEach(function(scoreItem, index) {
    const rankCell = createRankCell(index + 1);
    const scoreCell = createScoreCell(scoreItem.score);
    const initialsCell = createInitialsCell(scoreItem.init);
    const highscoreTableRow = createHighscoreTableRow(rankCell, scoreCell, initialsCell);
    HIGHSCORE_TABLE.appendChild(highscoreTableRow);
  });
}

function createRankCell(rank) {
  const rankCell = document.createElement('td');
  rankCell.textContent = `#${rank}`;
  return rankCell;
}

function createScoreCell(score) {
  const scoreCell = document.createElement('td');
  scoreCell.textContent = score;
  return scoreCell;
}

function createInitialsCell(init) {
  const initialsCell = document.createElement('td');
  initialsCell.textContent = init;
  return initialsCell;
}

function createHighscoreTableRow(rankCell, scoreCell, initialsCell) {
  const tableRow = document.createElement('tr');
  tableRow.appendChild(rankCell);
  tableRow.appendChild(scoreCell);
  tableRow.appendChild(initialsCell);
  return tableRow;
}


function clearHighscores() {
  localStorage.setItem('scoreList', []);
  while (HIGHSCORE_TABLE.children.length > 1) {
    HIGHSCORE_TABLE.removeChild(HIGHSCORE_TABLE.lastChild);
  }
}