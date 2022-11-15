export const SyGame = {
  setup: () => ({
    cells: Array(9).fill(null),
    counters: Array(2).fill(0),
    board: Array(2).fill([]),
    hand: Array(2).fill([]),
    deck: BuildDeck()
  }),

  turn: {
    minMoves: 1,
    maxMoves: 1,
  },

  moves: {
    playCard: ({ G, playerID }, card) => {
    },
    drawCard: ({ G, playerID }, card) => {
      G.hand[playerID].push(ContainerCard())
      console.log("foo")
    },
  },

  endIf: ({ G, ctx }) => {
    if (G.counters[ctx.currentPlayer] === 3) {
      return { winner: ctx.currentPlayer };
    }
  },

};

function BuildDeck() {
  let deck = []
  for(var i = 0; i < 10; i++){
    deck.push(ContainerCard());
  }
  return deck;
}

function ContainerCard(){
  return {
    title: "Container",
    description: "Place on your board",
    points: 1,
  }
}
