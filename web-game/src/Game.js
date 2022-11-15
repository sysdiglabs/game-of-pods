export const SyGame = {
  setup: () => ({
    board: Array(2).fill([]),
    hand: Array(2).fill([]),
    deck: buildDeck()
  }),

  turn: {
    onBegin: ({ G, ctx, events }) => {
      events.setActivePlayers({ currentPlayer: 'draw' })
    },
    stages: {
      draw: {
        moves: { drawCard },
        next: 'play',
      },
      play: {
        moves: { playCard },
      },
    }
  },

  endIf: ({ G, ctx }) => {
    if (G.deck.length === 0) {
      return { winner: ctx.currentPlayer };
    }
  },

};

function drawCard({ G, playerID, events }, card) {
  G.hand[playerID].push(G.deck.pop());
  events.endStage();
}

function playCard({ G, playerID, events }, card) {
  card.actions.forEach(action => {
    processAction({ G, playerID, events}, 'on_played', action, card);
  });

  events.endTurn();
}

function processAction({ G, playerID, events }, when, action, card) {
  if ( action.when !== when ) { return; }

  switch(action.type) {
    case 'place': action_Place({ G, playerID, events}, action, card); break;
    default: break;
  }
}

function action_Place({ G, playerID, events}, action, card) {
  G.hand[playerID] = G.hand[playerID].filter(function(e) { return e.index !== card.index })
  G.board[playerID].push(card);
}

function buildDeck() {
  let deck = []
  for(var i = 0; i < 10; i++){
    deck.push(buildContainerCard(i));
  }
  return deck;
}

function buildContainerCard(index){
  return {
    "index": index,
    "id": "aws_cluster",
    "title": "AWS Cluster",
    "description": "Place on your board",
    "units": 2,
    "vendor": "AWS",
    "type": "cluster",
    "actions": [
      {
        "when": "on_played",
        "type": "place"
      }
    ]
  };
}
