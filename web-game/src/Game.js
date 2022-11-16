const player_count = 2; // TODO: Read from context

export const SyGame = {
  setup: () => ({
    board: Array(player_count).fill([]),
    hand: Array(player_count).fill([]),
    deck: buildDeck(),
    pendingActions: [],
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
  events.endTurn();
}

function processNextAction({ G, playerID, events }, when, card) {
  if (G.pendingActions.length > 0) {
    let action = G.pendingActions.shift();
    let next = processAction({ G, playerID, events }, when, action, card);
    if (next) {
      processNextAction({ G, playerID, events }, when, card);
    }
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
}

function action_place({ G, playerID, events}, action, card) {
  G.hand[playerID] = G.hand[playerID].filter(function(e) { return e.instance_id !== card.instance_id })
  G.board[playerID].push(card);
}

/*
  {
    "when": "on_played",
    "type": "remove_or_reveal",
    "target": 
      {
        "who": "others",
        "type": ["cluster"],
        "select": "one"
      },
    "condition_remove": 
      {
        "vendor": ["AWS"]
      },
    "condition_reveal": 
      {
        "vendor": ["Azure","GCP","OpenShift"]
      }
  }
  */
function action_remove_or_reveal({ G, playerID, events}, action, card) {
  //G.hand[playerID] = G.hand[playerID].filter(function(e) { return e.instance_id !== card.instance_id })
  // Set 
}

function action_remove_or_reveal_select_cards({ G, playerID, events}, action, card) {

}

function action_remove_or_reveal_apply_selection({ G, playerID, events}, action, card) {

}

function buildDeck() {
  let deck = []
  var i = 0;
  for(; i < 10; i++){
    let card = buildAWSClusterCard();
    card["instance_id"] = i;
    deck.push(card);
  }
  for(; i < 20; i++){
    let card = buildAzureClusterCard();
    card["instance_id"] = i;
    deck.push(card);
  }
  for(; i < 30; i++){
    let card = buildAWSVulnerabilityCard();
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

function buildAWSClusterCard(){
  return {
    "id": "aws_cluster",
    "title": "AWS Cluster",
    "description": "Infraestructure block in an AWS cloud",
    "units": 2,
    "vendor": "AWS",
    "type": "cluster",
    "actions": [
      {
        "when": "on_played",
        "type": "place"
      }
    ]
  }
}

function buildAzureClusterCard(){
  return {
    "id": "azure_cluster",
    "title": "Azure Cluster",
    "description": "",
    "units": 2,
    "vendor": "Azure",
    "type": "cluster",
    "actions": [
      {
        "when": "on_played",
        "type": "place"
      }
    ]
  }
}

function buildAWSVulnerabilityCard(){
  return {
    "id": "aws_vulnerability",
    "title": "Exploit AWS vulnerability",
    "description": "Let's set this S3 bucket open for good measure... Reveal target cluster. If it's an AWS cluster, destroy it.",
    "units": 2,
    "type": "offense",
    "actions": [
      {
        "when": "on_played",
        "type": "remove_or_reveal",
        "target": 
          {
            "who": "others",
            "type": ["cluster"],
            "select": "one"
          },
        "condition_remove": 
          {
            "vendor": ["AWS"]
          },
        "condition_reveal": 
          {
            "vendor": ["Azure","GCP","OpenShift"]
          }
      },
      {
        "when": "on_played",
        "type": "autodestroy"
      }
    ]
  }
}
