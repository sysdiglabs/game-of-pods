import cards from './cards.json'

const player_count = 2; // TODO: Read from context

export const SyGame = {
  setup: () => ({
    board: Array(player_count).fill([]),
    hand: Array(player_count).fill([]),
    deck: buildDeck(), //buildRandomDeck(),
    pendingActions: [],
    selection: {},
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
        next: 'draw',
      },
      select: {
        moves: { selectCard },
      }
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
  if (G.hand[playerID].length >= 5) {
    events.endStage();
  }
}

function playCard({ G, playerID, events }, card) {
  G.pendingActions = card.actions.concat(G.pendingActions);
  processNextAction({ G, playerID, events}, 'on_played', card);
}

function selectCard({ G, playerID, events }, card) {
  G.selection.cards.push(card);
  if (G.selection.cards.length >= G.selection.maxCards) {
    events.setStage(G.selection.next);
    processNextAction({ G, playerID, events}, 'on_played', G.selection.acting_card);
  }
}

function processNextAction({ G, playerID, events }, when, card) {
  if (G.pendingActions.length > 0) {
    let action = G.pendingActions.shift();
    let next = processAction({ G, playerID, events }, when, action, card);
    if (next) {
      processNextAction({ G, playerID, events }, when, card);
    }
  } else {
    events.endTurn();
  }
}

function processAction({ G, playerID, events }, when, action, card) {
  if ( action.when !== when ) { return true; }

  switch(action.type) {
    case 'place': return action_place({ G, playerID, events}, action, card);
    case 'remove_or_reveal': return action_remove_or_reveal({ G, playerID, events}, action, card);;
    case 'autodestroy': return action_autodestroy({ G, playerID, events}, action, card);;
    default: return true;
  }
}

function action_autodestroy({ G, playerID, events}, action, card) {
  G.hand[playerID] = G.hand[playerID].filter(function(e) { return e.instance_id !== card.instance_id })
  return true;
}

function action_place({ G, playerID, events}, action, card) {
  G.hand[playerID] = G.hand[playerID].filter(function(e) { return e.instance_id !== card.instance_id })
  G.board[playerID].push(card);
  return true;
}

function action_remove_or_reveal({ G, playerID, events}, action, card) {
  switch (G.selection.status) {
    case 'selection_prepared': return action_remove_or_reveal_apply_selection({ G, playerID, events}, action, card);
    default: return action_remove_or_reveal_prepare({ G, playerID, events}, action, card);
  }
}

function action_remove_or_reveal_prepare({ G, playerID, events}, action, card) {
  // Set the selectable card conditions.
  resetSelection(G);
  G.selection.maxCards = 1; // TODO: Read from target
  G.selection.target = action.target;
  G.selection.next = 'playCard';
  G.selection.acting_card = card;

  // Push the action back.
  G.selection.status = 'selection_prepared';
  G.pendingActions.unshift(action);

  // Set stage to select cards.
  events.setStage('select');

  // Break the flow of action execution
  return false;
}

function action_remove_or_reveal_apply_selection({ G, playerID, events}, action, card) {
  G.selection.cards.forEach(card => {
    let condition_remove = new Map(Object.entries(action.condition_remove));
    condition_remove.forEach((values, property) => {
      if (values.includes(card[property])) {
        findAndEraseCardFromGame(G, card);
      }
    });
  });
  // TODO: Implement reveal
  G.selection.cards.forEach(card => {
    let condition_reveal = new Map(Object.entries(action.condition_reveal));
    condition_reveal.forEach((values, property) => {
      if (values.includes(card[property])) {
        // TODO: REVEAL
      }
    });
  });
  return true;
}

function findAndEraseCardFromGame(G, card) {
  G.board.forEach((board, player_index) => {
    G.board[player_index] = board.filter(function(e) { return e.instance_id !== card.instance_id });
    return;
  });
  G.hand.forEach((hand, player_index) => {
    G.hand[player_index] = hand.filter(function(e) { return e.instance_id !== card.instance_id });
    return;
  });
}

function resetSelection(G) {
  G.selection = {
    status: '',
    maxCards: 0,
    target: {},
    constraints: {},
    cards: [],
    next: '',
    acting_card: null,
  };
}

function buildRandomDeck() {
  let deck = []
  let cardsy = cards.cards;
  for (var i = 0; i < 100; i++) {
    let ci = Math.random() * cardsy.length;
    let card = JSON.parse(JSON.stringify(cardsy[ci]));
    card["instance_id"] = i;
    deck.push(card);
  }
  deck = shuffle(deck);
  return deck;
}

function buildDeck() {
  let deck = []
  var i = 0;
  for(; i < 10; i++){
    let card_import = cards.cards.find(card => card.id === 'aws_cluster');
    let card = JSON.parse(JSON.stringify(card_import));
    card["instance_id"] = i;
    deck.push(card);
  }
  for(; i < 20; i++){
    let card_import = cards.cards.find(card => card.id === 'azure_cluster');
    let card = JSON.parse(JSON.stringify(card_import));
    card["instance_id"] = i;
    deck.push(card);
  }
  for(; i < 30; i++){
    let card_import = cards.cards.find(card => card.id === 'aws_vulnerability');
    let card = JSON.parse(JSON.stringify(card_import));
    card["instance_id"] = i;
    deck.push(card);
  }
  deck = shuffle(deck);
  return deck;
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
