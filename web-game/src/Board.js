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


  let board0 = [];
  G.board[0].forEach((card) => {
    board0.push(UpsideCard(card, null ));
  });
  let hand0 = [];
  G.hand[0].forEach((card) => {
    if (ctx.currentPlayer === "0") {
      hand0.push(UpsideCard(card, () => onPlayCard(card) ));
    } else {
      hand0.push(DownCard(card, null));
    }
  });

  let board1 = [];
  G.board[1].forEach((card) => {
    board1.push(UpsideCard(card, null ));
  });

  let hand1 = [];
  G.hand[1].forEach((card) => {
    if (ctx.currentPlayer === "1") {
      hand1.push(UpsideCard(card, () => onPlayCard(card) ));
    } else {
      hand1.push(DownCard(card, null));
    }
  });

  let deck = [];
  deck.push(DownCard(null, () => onDrawCard() ));

  return (
    <div>
      <div id="board-1">
        <div style={sectionStyle}><p>Player 0 board</p>{board0}</div>
        <div style={sectionStyle}><p>Player 0 hand</p>{hand0}</div>
      </div>
      <div id="board-2">
        <div style={sectionStyle}><p>Player 1 board</p>{board1}</div>
        <div style={sectionStyle}><p>Player 1 hand</p>{hand1}</div>
      </div>
      <div id="deck">
        <div style={sectionStyle}><p>Deck</p>{deck}</div>
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


function UpsideCard(card, onClick){
  return (
    <div style={cardStyle} onClick={onClick}>
      <img src="http://placekitten.com/100/100" alt="card illustration"/>
      <div><b>{card.title}</b></div>
      <div>{card.description}</div>
      <div><i>Points: {card.points}</i></div>
    </div>
  )
}

function DownCard(card, onClick){
  return <div style={cardStyle} onClick={onClick} />
}
