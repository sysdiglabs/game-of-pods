import React from 'react';
import './cards.css';

export function SyBoard({ ctx, G, moves }) {
  const onPlayCard = (card) => moves.playCard(card);
  const onDrawCard = () => moves.drawCard();
  const onSelectCard = (card) => moves.selectCard(card);

  const ref = React.useRef(null);
  const handleClick = () => {
    ref.current?.scrollIntoView({behavior: 'smooth'});
    var head = document.getElementById('board-header-container')
    head.style.display = 'none';
    head.style.visibility = 'hidden';
    var bg = document.getElementById('bg');
    bg.style.backgroundImage = 'none';
    var board = document.getElementById('board');
    board.style.display = 'flex';
  };

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

    let isSelectStage = ctx.activePlayers[ctx.currentPlayer] === "select";
    G.board[renderPlayer].forEach((card) => {
      let callback = null;
      if (isSelectStage) {
        let constraints = new Map(Object.entries(G.selection.target));
        constraints.forEach((values, property) => {
          if (values.includes(card[property])) { // TODO: Check also the value of others.
            callback = () => onSelectCard(card);
          }
        });
      }
      board.push(UpsideCard(card, callback ));
    });

    G.hand[renderPlayer].forEach((card) => {
      if (isCurrentPlayer) {
        hand.push(UpsideCard(card, () => onPlayCard(card) ));
      } else {
        hand.push(DownCard(card, null));
      }
    });

    // let board_style = (isPlayerBoardSelected) ? currentSectionStyle : sectionStyle;
    // let hand_style = (isPlayerHandSelected) ? currentSectionStyle : sectionStyle;
    //let board_style = (isPlayerBoardSelected) ? 'current-section-board' : 'no-current-section-board';
    //let hand_style = (isPlayerHandSelected) ? 'current-section-board' : 'no-current-section-board';
    boards.push(
      <div id="board-{ctx.currentPlayer}" class="half-board">
        <div className="section-board">
          <p>Player {renderPlayer} board</p>
          <div className="section-board-cards">{board}</div>
        </div>
        <div className={"section-board"}>
          <p>Player {renderPlayer} hand</p>
          <div className="section-board-cards">{hand}</div>
          </div>
      </div>
    );
  }

  let deck = [];
  deck.push(DownCard(null, () => onDrawCard() ));

  let isDrawStage = ctx.activePlayers[ctx.currentPlayer] === "draw";
  let deck_style = (isDrawStage) ? currentSectionStyle : sectionStyle;
  return (
    <div id="bg">
      <div id="board-header-container">
        <div class="board-header"></div>
        <div class="board-header-menu">
          <div class="play-button" onClick={handleClick}>Play!</div>
        </div>
      </div>
      <div ref={ref} id="board" hidden>
        {boards[0]}
        <div id="deck" class="deck-half">
          <div style={deck_style}><p>Deck</p>{deck}</div>
        </div>
        {boards[1]}
        {winner}
      </div>
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
};

const currentSectionStyle = {
  border: '5px solid #5A5',
};

function UpsideCard(card, onClick){
  return (
    <div id={card['instance_id']} className='card-style' onClick={onClick}>
      <img src={"cards-images/" + card.id + ".png"} alt="card illustration" width="100%" height="100%"/>
      {/*<div><b>{card.title}</b></div>
      <div>{card.description}</div>*/}
    </div>
  )
}

function DownCard(card, onClick){
  return <div className='card-style back-card' onClick={onClick} />
}
