import React from 'react';

export function SyBoard({ ctx, G, moves }) {
  const onPlayCard = (card) => moves.playCard(card);
  const onDrawCard = () => moves.drawCard();

  let winner = '';
  if (ctx.gameover) {
    winner =
      ctx.gameover.winner !== undefined ? (
        <div id="winner">Winner: {ctx.gameover.winner}</div>
      ) : (
        <div id="winner">Draw!</div>
      );
  }

  let boards = [];
  for (var renderPlayer = 0; renderPlayer < ctx.numPlayers; renderPlayer++) {
    let board = [];
    let hand = [];
    let isCurrentPlayer = ctx.currentPlayer === ""+renderPlayer;
    let isPlayerHandSelected = isCurrentPlayer && ctx.activePlayers[ctx.currentPlayer] === "play";
    let isPlayerBoardSelected = false;

    G.board[renderPlayer].forEach((card) => {
      board.push(UpsideCard(card, null ));
    });

    G.hand[renderPlayer].forEach((card) => {
      if (isCurrentPlayer) {
        hand.push(UpsideCard(card, () => onPlayCard(card) ));
      } else {
        hand.push(DownCard(card, null));
      }
    });

    let board_style = (isPlayerBoardSelected) ? currentSectionStyle : sectionStyle;
    let hand_style = (isPlayerHandSelected) ? currentSectionStyle : sectionStyle;
    boards.push(
      <div id="board-{ctx.currentPlayer}">
        <div style={board_style}><p>Player {ctx.currentPlayer} board</p>{board}</div>
        <div style={hand_style}><p>Player {ctx.currentPlayer} hand</p>{hand}</div>
      </div>
    );
  }

  let deck = [];
  deck.push(DownCard(null, () => onDrawCard() ));

  let isDrawStage = ctx.activePlayers[ctx.currentPlayer] === "draw";
  let deck_style = (isDrawStage) ? currentSectionStyle : sectionStyle;
  return (
    <div>
      {boards}
      <div id="deck">
        <div style={deck_style}><p>Deck</p>{deck}</div>
      </div>
      {winner}
    </div>
  );
}

const cardStyle = {
  border: '1px solid #555',
  width: '120px',
  height: '200px',
  margin: '5px',
  padding: '5px',
  display: 'inline-block',
  textAlign: 'center',
};

const sectionStyle = {
  border: '1px solid #555',
  padding: '5px',
  margin: '5px',
  textAlign: 'center',
};

const currentSectionStyle = {
  border: '5px solid #5A5',
  padding: '5px',
  margin: '5px',
  textAlign: 'center',
};

function UpsideCard(card, onClick){
  return (
    <div style={cardStyle} onClick={onClick}>
      <img src="http://placekitten.com/100/100" alt="card illustration"/>
      <div><b>{card.title}</b></div>
      <div>{card.description}</div>
    </div>
  )
}

function DownCard(card, onClick){
  return <div style={cardStyle} onClick={onClick} />
}
