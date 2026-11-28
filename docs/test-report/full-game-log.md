# 502 – full game test log

Seed 341 · players: You, Nova, Rex · 13 rounds · 434 turns · winner: **Nova**

Automated rule checks passed: **4262** · failures: **0**

Special cases seen in this game:
- ✅ 2 played – next player draws 2
- ✅ 2s stacked (penalty grows by 2 each time)
- ✅ A♠ played – next player draws 5
- ✅ A♠ penalty passed on with another Ace
- ✅ 8 played – next player skipped
- ✅ Skip passed on with another 8
- ✅ Jack played and a new suit named
- ✅ 7♥ played – round ends instantly
- ✅ Penalty accepted (cards drawn)
- ✅ Skip accepted (turn lost, no cards)
- ✅ No playable card – drew 1
- ✅ Won with a 2/A♠ as last card – next player still draws
- ✅ Draw pile ran out – discard pile reshuffled
- ✅ Player eliminated at 502+
- ✅ Game over, winner shown, Play again resets

Illegal moves tried on every turn (all must be refused, game unchanged):
- Out-of-turn move: rejected correctly 434 times
- Illegal card: rejected correctly 409 times
- Accept with no penalty: rejected correctly 361 times
- Draw during a penalty: rejected correctly 73 times
- Jack without a suit: rejected correctly 96 times

## Round 1

Starting card: **5♥** · first turn: **You**

Hands dealt (7 cards each):

- You: 6♠ 4♣ 4♦ 9♥ 8♥ 8♣ 2♥
- Nova: 7♣ K♦ J♥ 4♥ 10♦ J♣ 9♦
- Rex: 5♣ 2♠ 10♠ 9♠ 7♠ 10♥ A♠

| # | Player | Action | Effect | Cards left | Check |
|---|---|---|---|---|---|
| 1 | You | played **8♥** | Next player is skipped unless they play an 8 → Nova's turn | 6 | ✅ |
| 2 | Nova | accepted the skip | Skipped – loses the turn, draws nothing → Rex's turn | 7 | ✅ |
| 3 | Rex | played **10♥** | Normal card → your turn | 6 | ✅ |
| 4 | You | played **2♥** | Next player must draw 2 or stack another 2 → Nova's turn | 5 | ✅ |
| 5 | Nova | accepted the penalty | Drew **2** penalty cards (a 2) → Rex's turn | 9 | ✅ |
| 6 | Rex | played **2♠** | Next player must draw 2 or stack another 2 → your turn | 5 | ✅ |
| 7 | You | accepted the penalty | Drew **2** penalty cards (a 2) → Nova's turn | 7 | ✅ |
| 8 | Nova | played **K♠** | Normal card → Rex's turn | 8 | ✅ |
| 9 | Rex | played **A♠** | A♠ – next player must draw 5 or pass it with an Ace → your turn | 4 | ✅ |
| 10 | You | accepted the penalty | Drew **5** penalty cards (A♠) → Nova's turn | 12 | ✅ |
| 11 | Nova | played **J♥** and named **Diamonds** | Jack wild – suit to follow is now Diamonds → Rex's turn | 7 | ✅ |
| 12 | Rex | drew a card | No playable card – drew 1, turn ends → your turn | 5 | ✅ |
| 13 | You | played **2♦** | Next player must draw 2 or stack another 2 → Nova's turn | 11 | ✅ |
| 14 | Nova | accepted the penalty | Drew **2** penalty cards (a 2) → Rex's turn | 9 | ✅ |
| 15 | Rex | drew a card | No playable card – drew 1, turn ends → your turn | 6 | ✅ |
| 16 | You | played **2♣** | Next player must draw 2 or stack another 2 → Nova's turn | 10 | ✅ |
| 17 | Nova | accepted the penalty | Drew **2** penalty cards (a 2) → Rex's turn | 11 | ✅ |
| 18 | Rex | played **A♣** | Normal Ace (no penalty) → your turn | 5 | ✅ |
| 19 | You | played **8♣** | Next player is skipped unless they play an 8 → Nova's turn | 9 | ✅ |
| 20 | Nova | accepted the skip | Skipped – loses the turn, draws nothing → Rex's turn | 11 | ✅ |
| 21 | Rex | played **5♣** | Normal card → your turn | 4 | ✅ |
| 22 | You | played **10♣** | Normal card → Nova's turn | 8 | ✅ |
| 23 | Nova | played **10♦** | Normal card → Rex's turn | 10 | ✅ |
| 24 | Rex | played **10♠** | Normal card → your turn | 3 | ✅ |
| 25 | You | played **8♠** | Next player is skipped unless they play an 8 → Nova's turn | 7 | ✅ |
| 26 | Nova | accepted the skip | Skipped – loses the turn, draws nothing → Rex's turn | 10 | ✅ |
| 27 | Rex | played **9♠** | Normal card → your turn | 2 | ✅ |
| 28 | You | played **9♥** | Normal card → Nova's turn | 6 | ✅ |
| 29 | Nova | played **A♥** | Normal Ace (no penalty) → Rex's turn | 9 | ✅ |
| 30 | Rex | drew a card | No playable card – drew 1, turn ends → your turn | 3 | ✅ |
| 31 | You | played **Q♥** | Normal card → Nova's turn | 5 | ✅ |
| 32 | Nova | played **4♥** | Normal card → Rex's turn | 8 | ✅ |
| 33 | Rex | drew a card | No playable card – drew 1, turn ends → your turn | 4 | ✅ |
| 34 | You | played **4♣** | Normal card → Nova's turn | 4 | ✅ |
| 35 | Nova | played **7♣** | Normal card → Rex's turn | 7 | ✅ |
| 36 | Rex | played **7♠** | Normal card → your turn | 3 | ✅ |
| 37 | You | played **6♠** | Normal card → Nova's turn | 3 | ✅ |
| 38 | Nova | played **J♣** and named **Diamonds** | Jack wild – suit to follow is now Diamonds → Rex's turn | 6 | ✅ |
| 39 | Rex | played **Q♦** | Normal card → your turn | 2 | ✅ |
| 40 | You | played **4♦** | Normal card → Nova's turn | 2 | ✅ |
| 41 | Nova | played **A♦** | Normal Ace (no penalty) → Rex's turn | 5 | ✅ |
| 42 | Rex | drew a card | No playable card – drew 1, turn ends → your turn | 3 | ✅ |
| 43 | You | played **3♦** | Normal card → Nova's turn | 1 | ✅ |
| 44 | Nova | played **K♦** | Normal card → Rex's turn | 4 | ✅ |
| 45 | Rex | played **J♦** and named **Spades** | Jack wild – suit to follow is now Spades → your turn | 2 | ✅ |
| 46 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 2 | ✅ |
| 47 | Nova | drew a card | No playable card – drew 1, turn ends → Rex's turn | 5 | ✅ |
| 48 | Rex | played **3♠** | Normal card → your turn | 1 | ✅ |
| 49 | You | played **Q♠** | Normal card → Nova's turn | 1 | ✅ |
| 50 | Nova | drew a card | No playable card – drew 1, turn ends → Rex's turn | 6 | ✅ |
| 51 | Rex | played **5♠** | Normal card · **last card – out of cards, wins the round** | 0 | ✅ |

**Round 1 won by Rex.** Cards left in hand count as penalty points:

| Player | Cards left | Round points | Total | Status |
|---|---|---|---|---|
| You | 6♣ | 5 | 5 | still in |
| Nova | 9♦ 3♣ 3♥ 7♦ 5♦ Q♣ | 35 | 35 | still in |
| Rex | – | 0 | 0 | 🏆 round winner |

## Round 2

Starting card: **7♦** · first turn: **Rex**

Hands dealt (7 cards each):

- You: 9♦ Q♠ 2♦ 10♥ 5♦ J♠ 6♠
- Nova: K♥ 5♠ 2♠ A♠ 8♦ 9♣ K♠
- Rex: A♣ A♥ 9♥ K♣ 7♠ 8♣ J♥

| # | Player | Action | Effect | Cards left | Check |
|---|---|---|---|---|---|
| 52 | Rex | played **7♠** | Normal card → your turn | 6 | ✅ |
| 53 | You | played **Q♠** | Normal card → Nova's turn | 6 | ✅ |
| 54 | Nova | played **A♠** | A♠ – next player must draw 5 or pass it with an Ace → Rex's turn | 6 | ✅ |
| 55 | Rex | played **A♣** | Ace passes the A♠ penalty on – next player must draw 5 or pass it with an Ace → your turn | 5 | ✅ |
| 56 | You | accepted the penalty | Drew **5** penalty cards (A♠) → Nova's turn | 11 | ✅ |
| 57 | Nova | played **9♣** | Normal card → Rex's turn | 5 | ✅ |
| 58 | Rex | played **8♣** | Next player is skipped unless they play an 8 → your turn | 4 | ✅ |
| 59 | You | played **8♠** | 8 passes the skip on – next player is skipped unless they play an 8 → Nova's turn | 10 | ✅ |
| 60 | Nova | played **8♦** | 8 passes the skip on – next player is skipped unless they play an 8 → Rex's turn | 4 | ✅ |
| 61 | Rex | accepted the skip | Skipped – loses the turn, draws nothing → your turn | 4 | ✅ |
| 62 | You | played **2♦** | Next player must draw 2 or stack another 2 → Nova's turn | 9 | ✅ |
| 63 | Nova | played **2♠** | 2 stacked – penalty grows from 2 to 4 cards → Rex's turn | 3 | ✅ |
| 64 | Rex | accepted the penalty | Drew **4** penalty cards (stacked 2s) → your turn | 8 | ✅ |
| 65 | You | played **6♠** | Normal card → Nova's turn | 8 | ✅ |
| 66 | Nova | played **K♠** | Normal card → Rex's turn | 2 | ✅ |
| 67 | Rex | played **K♣** | Normal card → your turn | 7 | ✅ |
| 68 | You | played **4♣** | Normal card → Nova's turn | 7 | ✅ |
| 69 | Nova | drew a card | No playable card – drew 1, turn ends → Rex's turn | 3 | ✅ |
| 70 | Rex | played **2♣** | Next player must draw 2 or stack another 2 → your turn | 6 | ✅ |
| 71 | You | accepted the penalty | Drew **2** penalty cards (a 2) → Nova's turn | 9 | ✅ |
| 72 | Nova | drew a card | No playable card – drew 1, turn ends → Rex's turn | 4 | ✅ |
| 73 | Rex | played **Q♣** | Normal card → your turn | 5 | ✅ |
| 74 | You | played **Q♦** | Normal card → Nova's turn | 8 | ✅ |
| 75 | Nova | played **4♦** | Normal card → Rex's turn | 3 | ✅ |
| 76 | Rex | played **4♠** | Normal card → your turn | 4 | ✅ |
| 77 | You | played **9♠** | Normal card → Nova's turn | 7 | ✅ |
| 78 | Nova | played **5♠** | Normal card → Rex's turn | 2 | ✅ |
| 79 | Rex | played **J♥** and named **Hearts** | Jack wild – suit to follow is now Hearts → your turn | 3 | ✅ |
| 80 | You | played **10♥** | Normal card → Nova's turn | 6 | ✅ |
| 81 | Nova | played **8♥** | Next player is skipped unless they play an 8 → Rex's turn | 1 | ✅ |
| 82 | Rex | accepted the skip | Skipped – loses the turn, draws nothing → your turn | 3 | ✅ |
| 83 | You | played **J♠** and named **Diamonds** | Jack wild – suit to follow is now Diamonds → Nova's turn | 5 | ✅ |
| 84 | Nova | drew a card | No playable card – drew 1, turn ends → Rex's turn | 2 | ✅ |
| 85 | Rex | drew a card | No playable card – drew 1, turn ends → your turn | 4 | ✅ |
| 86 | You | played **K♦** | Normal card → Nova's turn | 4 | ✅ |
| 87 | Nova | played **K♥** | Normal card → Rex's turn | 1 | ✅ |
| 88 | Rex | played **A♥** | Normal Ace (no penalty) → your turn | 3 | ✅ |
| 89 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 5 | ✅ |
| 90 | Nova | played **2♥** | Next player must draw 2 or stack another 2 · **last card – out of cards, wins the round** · Rex still draws 2 | 0 | ✅ |

**Round 2 won by Nova.** Cards left in hand count as penalty points:

| Player | Cards left | Round points | Total | Status |
|---|---|---|---|---|
| You | 9♦ 5♦ 3♠ 6♣ A♦ | 40 | 45 | still in |
| Nova | – | 0 | 35 | 🏆 round winner |
| Rex | 9♥ 3♣ 10♣ 10♦ J♦ | 60 | 60 | still in |

## Round 3

Starting card: **K♦** · first turn: **Nova**

Hands dealt (7 cards each):

- You: 3♠ K♥ 8♦ 6♥ 6♣ 5♣ 10♦
- Nova: 9♦ 9♥ 4♠ A♥ 5♥ 4♥ 3♦
- Rex: A♦ 10♠ 7♠ 3♥ 2♥ 3♣ K♠

| # | Player | Action | Effect | Cards left | Check |
|---|---|---|---|---|---|
| 91 | Nova | played **9♦** | Normal card → Rex's turn | 6 | ✅ |
| 92 | Rex | played **A♦** | Normal Ace (no penalty) → your turn | 6 | ✅ |
| 93 | You | played **8♦** | Next player is skipped unless they play an 8 → Nova's turn | 6 | ✅ |
| 94 | Nova | accepted the skip | Skipped – loses the turn, draws nothing → Rex's turn | 6 | ✅ |
| 95 | Rex | drew a card | No playable card – drew 1, turn ends → your turn | 7 | ✅ |
| 96 | You | played **10♦** | Normal card → Nova's turn | 5 | ✅ |
| 97 | Nova | played **3♦** | Normal card → Rex's turn | 5 | ✅ |
| 98 | Rex | played **3♥** | Normal card → your turn | 6 | ✅ |
| 99 | You | played **K♥** | Normal card → Nova's turn | 4 | ✅ |
| 100 | Nova | played **A♥** | Normal Ace (no penalty) → Rex's turn | 4 | ✅ |
| 101 | Rex | played **2♥** | Next player must draw 2 or stack another 2 → your turn | 5 | ✅ |
| 102 | You | accepted the penalty | Drew **2** penalty cards (a 2) → Nova's turn | 6 | ✅ |
| 103 | Nova | played **9♥** | Normal card → Rex's turn | 3 | ✅ |
| 104 | Rex | drew a card | No playable card – drew 1, turn ends → your turn | 6 | ✅ |
| 105 | You | played **6♥** | Normal card → Nova's turn | 5 | ✅ |
| 106 | Nova | played **5♥** | Normal card → Rex's turn | 2 | ✅ |
| 107 | Rex | drew a card | No playable card – drew 1, turn ends → your turn | 7 | ✅ |
| 108 | You | played **5♣** | Normal card → Nova's turn | 4 | ✅ |
| 109 | Nova | drew a card | No playable card – drew 1, turn ends → Rex's turn | 3 | ✅ |
| 110 | Rex | played **8♣** | Next player is skipped unless they play an 8 → your turn | 6 | ✅ |
| 111 | You | accepted the skip | Skipped – loses the turn, draws nothing → Nova's turn | 4 | ✅ |
| 112 | Nova | drew a card | No playable card – drew 1, turn ends → Rex's turn | 4 | ✅ |
| 113 | Rex | played **3♣** | Normal card → your turn | 5 | ✅ |
| 114 | You | played **K♣** | Normal card → Nova's turn | 3 | ✅ |
| 115 | Nova | drew a card | No playable card – drew 1, turn ends → Rex's turn | 5 | ✅ |
| 116 | Rex | played **K♠** | Normal card → your turn | 4 | ✅ |
| 117 | You | played **3♠** | Normal card → Nova's turn | 2 | ✅ |
| 118 | Nova | played **4♠** | Normal card → Rex's turn | 4 | ✅ |
| 119 | Rex | played **2♠** | Next player must draw 2 or stack another 2 → your turn | 3 | ✅ |
| 120 | You | played **2♦** | 2 stacked – penalty grows from 2 to 4 cards → Nova's turn | 1 | ✅ |
| 121 | Nova | accepted the penalty | Drew **4** penalty cards (stacked 2s) → Rex's turn | 8 | ✅ |
| 122 | Rex | drew a card | No playable card – drew 1, turn ends → your turn | 4 | ✅ |
| 123 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 2 | ✅ |
| 124 | Nova | played **Q♦** | Normal card → Rex's turn | 7 | ✅ |
| 125 | Rex | played **5♦** | Normal card → your turn | 3 | ✅ |
| 126 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 3 | ✅ |
| 127 | Nova | played **4♦** | Normal card → Rex's turn | 6 | ✅ |
| 128 | Rex | drew a card | No playable card – drew 1, turn ends → your turn | 4 | ✅ |
| 129 | You | played **J♣** and named **Hearts** | Jack wild – suit to follow is now Hearts → Nova's turn | 2 | ✅ |
| 130 | Nova | played **Q♥** | Normal card → Rex's turn | 5 | ✅ |
| 131 | Rex | played **J♥** and named **Spades** | Jack wild – suit to follow is now Spades → your turn | 3 | ✅ |
| 132 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 3 | ✅ |
| 133 | Nova | drew a card | No playable card – drew 1, turn ends → Rex's turn | 6 | ✅ |
| 134 | Rex | played **10♠** | Normal card → your turn | 2 | ✅ |
| 135 | You | played **5♠** | Normal card → Nova's turn | 2 | ✅ |
| 136 | Nova | played **Q♠** | Normal card → Rex's turn | 5 | ✅ |
| 137 | Rex | played **7♠** | Normal card → your turn | 1 | ✅ |
| 138 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 3 | ✅ |
| 139 | Nova | drew a card | No playable card – drew 1, turn ends → Rex's turn | 6 | ✅ |
| 140 | Rex | played **9♠** | Normal card · **last card – out of cards, wins the round** | 0 | ✅ |

**Round 3 won by Rex.** Cards left in hand count as penalty points:

| Player | Cards left | Round points | Total | Status |
|---|---|---|---|---|
| You | 6♣ 8♥ A♣ | 55 | 100 | still in |
| Nova | 4♥ 4♣ 10♣ Q♣ 6♦ 7♣ | 40 | 75 | still in |
| Rex | – | 0 | 60 | 🏆 round winner |

## Round 4

Starting card: **10♦** · first turn: **Rex**

Hands dealt (7 cards each):

- You: A♦ 2♦ 8♥ 8♦ 4♠ 10♠ 7♦
- Nova: 3♦ K♥ 9♦ 6♥ Q♣ K♣ 5♠
- Rex: Q♠ K♦ 5♦ 4♦ Q♦ 2♣ 5♣

| # | Player | Action | Effect | Cards left | Check |
|---|---|---|---|---|---|
| 141 | Rex | played **K♦** | Normal card → your turn | 6 | ✅ |
| 142 | You | played **2♦** | Next player must draw 2 or stack another 2 → Nova's turn | 6 | ✅ |
| 143 | Nova | accepted the penalty | Drew **2** penalty cards (a 2) → Rex's turn | 9 | ✅ |
| 144 | Rex | played **2♣** | Next player must draw 2 or stack another 2 → your turn | 5 | ✅ |
| 145 | You | accepted the penalty | Drew **2** penalty cards (a 2) → Nova's turn | 8 | ✅ |
| 146 | Nova | played **Q♣** | Normal card → Rex's turn | 8 | ✅ |
| 147 | Rex | played **Q♦** | Normal card → your turn | 4 | ✅ |
| 148 | You | played **8♦** | Next player is skipped unless they play an 8 → Nova's turn | 7 | ✅ |
| 149 | Nova | accepted the skip | Skipped – loses the turn, draws nothing → Rex's turn | 8 | ✅ |
| 150 | Rex | played **5♦** | Normal card → your turn | 3 | ✅ |
| 151 | You | played **A♦** | Normal Ace (no penalty) → Nova's turn | 6 | ✅ |
| 152 | Nova | played **3♦** | Normal card → Rex's turn | 7 | ✅ |
| 153 | Rex | played **4♦** | Normal card → your turn | 2 | ✅ |
| 154 | You | played **4♠** | Normal card → Nova's turn | 5 | ✅ |
| 155 | Nova | played **5♠** | Normal card → Rex's turn | 6 | ✅ |
| 156 | Rex | played **Q♠** | Normal card → your turn | 1 | ✅ |
| 157 | You | played **10♠** | Normal card → Nova's turn | 4 | ✅ |
| 158 | Nova | played **6♠** | Normal card → Rex's turn | 5 | ✅ |
| 159 | Rex | drew a card | No playable card – drew 1, turn ends → your turn | 2 | ✅ |
| 160 | You | played **7♠** | Normal card → Nova's turn | 3 | ✅ |
| 161 | Nova | played **J♣** and named **Hearts** | Jack wild – suit to follow is now Hearts → Rex's turn | 4 | ✅ |
| 162 | Rex | drew a card | No playable card – drew 1, turn ends → your turn | 3 | ✅ |
| 163 | You | played **8♥** | Next player is skipped unless they play an 8 → Nova's turn | 2 | ✅ |
| 164 | Nova | accepted the skip | Skipped – loses the turn, draws nothing → Rex's turn | 4 | ✅ |
| 165 | Rex | drew a card | No playable card – drew 1, turn ends → your turn | 4 | ✅ |
| 166 | You | played **A♥** | Normal Ace (no penalty) → Nova's turn | 1 | ✅ |
| 167 | Nova | played **K♥** | Normal card → Rex's turn | 3 | ✅ |
| 168 | Rex | played **2♥** | Next player must draw 2 or stack another 2 → your turn | 3 | ✅ |
| 169 | You | accepted the penalty | Drew **2** penalty cards (a 2) → Nova's turn | 3 | ✅ |
| 170 | Nova | played **6♥** | Normal card → Rex's turn | 2 | ✅ |
| 171 | Rex | drew a card | No playable card – drew 1, turn ends → your turn | 4 | ✅ |
| 172 | You | played **J♥** and named **Spades** | Jack wild – suit to follow is now Spades → Nova's turn | 2 | ✅ |
| 173 | Nova | drew a card | No playable card – drew 1, turn ends → Rex's turn | 3 | ✅ |
| 174 | Rex | played **9♠** | Normal card → your turn | 3 | ✅ |
| 175 | You | played **A♠** | A♠ – next player must draw 5 or pass it with an Ace → Nova's turn | 1 | ✅ |
| 176 | Nova | accepted the penalty | Drew **5** penalty cards (A♠) → Rex's turn | 8 | ✅ |
| 177 | Rex | played **A♣** | Normal Ace (no penalty) → your turn | 2 | ✅ |
| 178 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 2 | ✅ |
| 179 | Nova | played **K♣** | Normal card → Rex's turn | 7 | ✅ |
| 180 | Rex | played **5♣** | Normal card → your turn | 1 | ✅ |
| 181 | You | played **10♣** | Normal card → Nova's turn | 1 | ✅ |
| 182 | Nova | played **9♣** | Normal card → Rex's turn | 6 | ✅ |
| 183 | Rex | played **7♣** | Normal card · **last card – out of cards, wins the round** | 0 | ✅ |

**Round 4 won by Rex.** Cards left in hand count as penalty points:

| Player | Cards left | Round points | Total | Status |
|---|---|---|---|---|
| You | 7♦ | 5 | 105 | still in |
| Nova | 9♦ K♠ 5♥ 3♣ J♦ J♠ | 85 | 160 | still in |
| Rex | – | 0 | 60 | 🏆 round winner |

## Round 5

Starting card: **3♥** · first turn: **Rex**

Hands dealt (7 cards each):

- You: 2♠ 3♣ 8♣ 4♣ 6♥ 6♣ 10♥
- Nova: 2♥ 8♥ 3♦ 9♠ K♣ 7♥ 5♦
- Rex: 7♣ Q♣ 5♠ 9♥ 3♠ Q♠ K♦

| # | Player | Action | Effect | Cards left | Check |
|---|---|---|---|---|---|
| 184 | Rex | played **3♠** | Normal card → your turn | 6 | ✅ |
| 185 | You | played **2♠** | Next player must draw 2 or stack another 2 → Nova's turn | 6 | ✅ |
| 186 | Nova | played **2♥** | 2 stacked – penalty grows from 2 to 4 cards → Rex's turn | 6 | ✅ |
| 187 | Rex | accepted the penalty | Drew **4** penalty cards (stacked 2s) → your turn | 10 | ✅ |
| 188 | You | played **10♥** | Normal card → Nova's turn | 5 | ✅ |
| 189 | Nova | played **8♥** | Next player is skipped unless they play an 8 → Rex's turn | 5 | ✅ |
| 190 | Rex | played **8♠** | 8 passes the skip on – next player is skipped unless they play an 8 → your turn | 9 | ✅ |
| 191 | You | played **8♣** | 8 passes the skip on – next player is skipped unless they play an 8 → Nova's turn | 4 | ✅ |
| 192 | Nova | accepted the skip | Skipped – loses the turn, draws nothing → Rex's turn | 5 | ✅ |
| 193 | Rex | played **Q♣** | Normal card → your turn | 8 | ✅ |
| 194 | You | played **3♣** | Normal card → Nova's turn | 3 | ✅ |
| 195 | Nova | played **7♥** | 7♥ wild – round ends immediately, player wins the round | 4 | ✅ |

**Round 5 won by Nova.** Cards left in hand count as penalty points:

| Player | Cards left | Round points | Total | Status |
|---|---|---|---|---|
| You | 4♣ 6♥ 6♣ | 15 | 120 | still in |
| Nova | 3♦ 9♠ K♣ 5♦ | 25 | 185 | 🏆 round winner |
| Rex | 7♣ 5♠ 9♥ Q♠ K♦ 7♦ J♦ 10♠ | 80 | 140 | still in |

## Round 6

Starting card: **4♣** · first turn: **You**

Hands dealt (7 cards each):

- You: J♥ 9♥ 4♥ K♦ 4♦ 10♥ 6♠
- Nova: 5♦ 7♠ J♠ Q♠ 3♦ 3♣ 6♣
- Rex: J♣ 5♠ 3♥ 2♠ 7♥ 3♠ 8♣

| # | Player | Action | Effect | Cards left | Check |
|---|---|---|---|---|---|
| 196 | You | played **4♥** | Normal card → Nova's turn | 6 | ✅ |
| 197 | Nova | played **J♠** and named **Spades** | Jack wild – suit to follow is now Spades → Rex's turn | 6 | ✅ |
| 198 | Rex | played **2♠** | Next player must draw 2 or stack another 2 → your turn | 6 | ✅ |
| 199 | You | accepted the penalty | Drew **2** penalty cards (a 2) → Nova's turn | 8 | ✅ |
| 200 | Nova | played **Q♠** | Normal card → Rex's turn | 5 | ✅ |
| 201 | Rex | played **5♠** | Normal card → your turn | 5 | ✅ |
| 202 | You | played **6♠** | Normal card → Nova's turn | 7 | ✅ |
| 203 | Nova | played **6♣** | Normal card → Rex's turn | 4 | ✅ |
| 204 | Rex | played **8♣** | Next player is skipped unless they play an 8 → your turn | 4 | ✅ |
| 205 | You | accepted the skip | Skipped – loses the turn, draws nothing → Nova's turn | 7 | ✅ |
| 206 | Nova | played **3♣** | Normal card → Rex's turn | 3 | ✅ |
| 207 | Rex | played **7♥** | 7♥ wild – round ends immediately, player wins the round | 3 | ✅ |

**Round 6 won by Rex.** Cards left in hand count as penalty points:

| Player | Cards left | Round points | Total | Status |
|---|---|---|---|---|
| You | J♥ 9♥ K♦ 4♦ 10♥ 2♣ Q♥ | 100 | 220 | still in |
| Nova | 5♦ 7♠ 3♦ | 15 | 200 | still in |
| Rex | J♣ 3♥ 3♠ | 40 | 180 | 🏆 round winner |

## Round 7

Starting card: **K♥** · first turn: **Nova**

Hands dealt (7 cards each):

- You: 6♦ 4♦ 9♠ A♦ 8♦ 2♠ 2♥
- Nova: K♣ Q♥ 10♦ A♠ J♥ 7♠ K♦
- Rex: 5♠ 7♣ 9♣ 6♥ 3♥ J♦ A♣

| # | Player | Action | Effect | Cards left | Check |
|---|---|---|---|---|---|
| 208 | Nova | played **Q♥** | Normal card → Rex's turn | 6 | ✅ |
| 209 | Rex | played **6♥** | Normal card → your turn | 6 | ✅ |
| 210 | You | played **2♥** | Next player must draw 2 or stack another 2 → Nova's turn | 6 | ✅ |
| 211 | Nova | accepted the penalty | Drew **2** penalty cards (a 2) → Rex's turn | 8 | ✅ |
| 212 | Rex | played **3♥** | Normal card → your turn | 5 | ✅ |
| 213 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 7 | ✅ |
| 214 | Nova | played **J♥** and named **Spades** | Jack wild – suit to follow is now Spades → Rex's turn | 7 | ✅ |
| 215 | Rex | played **5♠** | Normal card → your turn | 4 | ✅ |
| 216 | You | played **2♠** | Next player must draw 2 or stack another 2 → Nova's turn | 6 | ✅ |
| 217 | Nova | played **2♦** | 2 stacked – penalty grows from 2 to 4 cards → Rex's turn | 6 | ✅ |
| 218 | Rex | accepted the penalty | Drew **4** penalty cards (stacked 2s) → your turn | 8 | ✅ |
| 219 | You | played **8♦** | Next player is skipped unless they play an 8 → Nova's turn | 5 | ✅ |
| 220 | Nova | accepted the skip | Skipped – loses the turn, draws nothing → Rex's turn | 6 | ✅ |
| 221 | Rex | played **J♦** and named **Clubs** | Jack wild – suit to follow is now Clubs → your turn | 7 | ✅ |
| 222 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 6 | ✅ |
| 223 | Nova | played **K♣** | Normal card → Rex's turn | 5 | ✅ |
| 224 | Rex | played **2♣** | Next player must draw 2 or stack another 2 → your turn | 6 | ✅ |
| 225 | You | accepted the penalty | Drew **2** penalty cards (a 2) → Nova's turn | 8 | ✅ |
| 226 | Nova | drew a card | No playable card – drew 1, turn ends → Rex's turn | 6 | ✅ |
| 227 | Rex | played **A♣** | Normal Ace (no penalty) → your turn | 5 | ✅ |
| 228 | You | played **A♦** | Normal Ace (no penalty) → Nova's turn | 7 | ✅ |
| 229 | Nova | played **A♠** | A♠ – next player must draw 5 or pass it with an Ace → Rex's turn | 5 | ✅ |
| 230 | Rex | accepted the penalty | Drew **5** penalty cards (A♠) → your turn | 10 | ✅ |
| 231 | You | played **7♥** | 7♥ wild – round ends immediately, player wins the round | 6 | ✅ |

**Round 7 won by You.** Cards left in hand count as penalty points:

| Player | Cards left | Round points | Total | Status |
|---|---|---|---|---|
| You | 6♦ 4♦ 9♠ 3♦ 9♦ 10♠ | 35 | 255 | 🏆 round winner |
| Nova | 10♦ 7♠ K♦ 6♠ 4♥ | 35 | 235 | still in |
| Rex | 7♣ 9♣ J♣ J♠ 5♣ K♠ 10♥ Q♠ Q♣ 8♥ | 145 | 325 | still in |

## Round 8

Starting card: **9♦** · first turn: **You**

Hands dealt (7 cards each):

- You: 8♦ 6♣ 6♠ 9♣ 2♥ 2♣ 3♣
- Nova: 7♦ J♠ K♦ 10♣ K♠ 3♦ Q♠
- Rex: A♥ 10♥ J♦ 5♠ 6♦ 5♣ 9♠

| # | Player | Action | Effect | Cards left | Check |
|---|---|---|---|---|---|
| 232 | You | played **8♦** | Next player is skipped unless they play an 8 → Nova's turn | 6 | ✅ |
| 233 | Nova | accepted the skip | Skipped – loses the turn, draws nothing → Rex's turn | 7 | ✅ |
| 234 | Rex | played **6♦** | Normal card → your turn | 6 | ✅ |
| 235 | You | played **6♣** | Normal card → Nova's turn | 5 | ✅ |
| 236 | Nova | played **10♣** | Normal card → Rex's turn | 6 | ✅ |
| 237 | Rex | played **10♥** | Normal card → your turn | 5 | ✅ |
| 238 | You | played **2♥** | Next player must draw 2 or stack another 2 → Nova's turn | 4 | ✅ |
| 239 | Nova | accepted the penalty | Drew **2** penalty cards (a 2) → Rex's turn | 8 | ✅ |
| 240 | Rex | played **A♥** | Normal Ace (no penalty) → your turn | 4 | ✅ |
| 241 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 5 | ✅ |
| 242 | Nova | played **J♠** and named **Diamonds** | Jack wild – suit to follow is now Diamonds → Rex's turn | 7 | ✅ |
| 243 | Rex | played **J♦** and named **Spades** | Jack wild – suit to follow is now Spades → your turn | 3 | ✅ |
| 244 | You | played **6♠** | Normal card → Nova's turn | 4 | ✅ |
| 245 | Nova | played **K♠** | Normal card → Rex's turn | 6 | ✅ |
| 246 | Rex | played **5♠** | Normal card → your turn | 2 | ✅ |
| 247 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 5 | ✅ |
| 248 | Nova | played **Q♠** | Normal card → Rex's turn | 5 | ✅ |
| 249 | Rex | played **9♠** | Normal card → your turn | 1 | ✅ |
| 250 | You | played **9♣** | Normal card → Nova's turn | 4 | ✅ |
| 251 | Nova | drew a card | No playable card – drew 1, turn ends → Rex's turn | 6 | ✅ |
| 252 | Rex | played **5♣** | Normal card · **last card – out of cards, wins the round** | 0 | ✅ |

**Round 8 won by Rex.** Cards left in hand count as penalty points:

| Player | Cards left | Round points | Total | Status |
|---|---|---|---|---|
| You | 2♣ 3♣ 7♣ 10♦ | 50 | 305 | still in |
| Nova | 7♦ K♦ 3♦ Q♦ 10♠ 4♣ | 45 | 280 | still in |
| Rex | – | 0 | 325 | 🏆 round winner |

## Round 9

Starting card: **4♣** · first turn: **Rex**

Hands dealt (7 cards each):

- You: 5♥ A♠ 2♠ 6♥ 8♣ 3♣ 10♣
- Nova: 8♦ 2♦ K♥ 2♣ 10♦ 6♦ A♦
- Rex: 7♣ 5♣ A♣ 3♠ 4♦ 4♠ 5♦

| # | Player | Action | Effect | Cards left | Check |
|---|---|---|---|---|---|
| 253 | Rex | played **A♣** | Normal Ace (no penalty) → your turn | 6 | ✅ |
| 254 | You | played **A♠** | A♠ – next player must draw 5 or pass it with an Ace → Nova's turn | 6 | ✅ |
| 255 | Nova | played **A♦** | Ace passes the A♠ penalty on – next player must draw 5 or pass it with an Ace → Rex's turn | 6 | ✅ |
| 256 | Rex | accepted the penalty | Drew **5** penalty cards (A♠) → your turn | 11 | ✅ |
| 257 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 7 | ✅ |
| 258 | Nova | played **8♦** | Next player is skipped unless they play an 8 → Rex's turn | 5 | ✅ |
| 259 | Rex | accepted the skip | Skipped – loses the turn, draws nothing → your turn | 11 | ✅ |
| 260 | You | played **8♣** | Next player is skipped unless they play an 8 → Nova's turn | 6 | ✅ |
| 261 | Nova | accepted the skip | Skipped – loses the turn, draws nothing → Rex's turn | 5 | ✅ |
| 262 | Rex | played **K♣** | Normal card → your turn | 10 | ✅ |
| 263 | You | played **10♣** | Normal card → Nova's turn | 5 | ✅ |
| 264 | Nova | played **2♣** | Next player must draw 2 or stack another 2 → Rex's turn | 4 | ✅ |
| 265 | Rex | accepted the penalty | Drew **2** penalty cards (a 2) → your turn | 12 | ✅ |
| 266 | You | played **2♠** | Next player must draw 2 or stack another 2 → Nova's turn | 4 | ✅ |
| 267 | Nova | played **2♦** | 2 stacked – penalty grows from 2 to 4 cards → Rex's turn | 3 | ✅ |
| 268 | Rex | accepted the penalty | Drew **4** penalty cards (stacked 2s) → your turn | 16 | ✅ |
| 269 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 5 | ✅ |
| 270 | Nova | played **10♦** | Normal card → Rex's turn | 2 | ✅ |
| 271 | Rex | played **4♦** | Normal card → your turn | 15 | ✅ |
| 272 | You | played **K♦** | Normal card → Nova's turn | 4 | ✅ |
| 273 | Nova | played **K♥** | Normal card → Rex's turn | 1 | ✅ |
| 274 | Rex | played **2♥** | Next player must draw 2 or stack another 2 → your turn | 14 | ✅ |
| 275 | You | accepted the penalty | Drew **2** penalty cards (a 2) → Nova's turn | 6 | ✅ |
| 276 | Nova | drew a card | No playable card – drew 1, turn ends → Rex's turn | 2 | ✅ |
| 277 | Rex | played **A♥** | Normal Ace (no penalty) → your turn | 13 | ✅ |
| 278 | You | played **5♥** | Normal card → Nova's turn | 5 | ✅ |
| 279 | Nova | drew a card | No playable card – drew 1, turn ends → Rex's turn | 3 | ✅ |
| 280 | Rex | played **Q♥** | Normal card → your turn | 12 | ✅ |
| 281 | You | played **Q♣** | Normal card → Nova's turn | 4 | ✅ |
| 282 | Nova | drew a card | No playable card – drew 1, turn ends → Rex's turn | 4 | ✅ |
| 283 | Rex | played **Q♠** | Normal card → your turn | 11 | ✅ |
| 284 | You | played **K♠** | Normal card → Nova's turn | 3 | ✅ |
| 285 | Nova | played **9♠** | Normal card → Rex's turn | 3 | ✅ |
| 286 | Rex | played **3♠** | Normal card → your turn | 10 | ✅ |
| 287 | You | played **3♣** | Normal card → Nova's turn | 2 | ✅ |
| 288 | Nova | played **3♦** | Normal card → Rex's turn | 2 | ✅ |
| 289 | Rex | played **5♦** | Normal card → your turn | 9 | ✅ |
| 290 | You | played **Q♦** | Normal card → Nova's turn | 1 | ✅ |
| 291 | Nova | played **6♦** | Normal card → Rex's turn | 1 | ✅ |
| 292 | Rex | played **9♦** | Normal card → your turn | 8 | ✅ |
| 293 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 2 | ✅ |
| 294 | Nova | played **7♦** | Normal card · **last card – out of cards, wins the round** | 0 | ✅ |

**Round 9 won by Nova.** Cards left in hand count as penalty points:

| Player | Cards left | Round points | Total | Status |
|---|---|---|---|---|
| You | 6♥ 8♠ | 35 | 340 | still in |
| Nova | – | 0 | 280 | 🏆 round winner |
| Rex | 7♣ 5♣ 4♠ J♦ 3♥ 4♥ 7♠ J♥ | 90 | 415 | still in |

## Round 10

Starting card: **3♣** · first turn: **Nova**

Hands dealt (7 cards each):

- You: 9♦ Q♠ 5♣ K♣ 6♦ Q♥ 4♦
- Nova: 9♣ A♥ 6♥ 8♦ J♠ 4♣ 3♦
- Rex: 10♣ Q♦ 5♥ 2♣ 2♠ 9♥ 7♠

| # | Player | Action | Effect | Cards left | Check |
|---|---|---|---|---|---|
| 295 | Nova | played **9♣** | Normal card → Rex's turn | 6 | ✅ |
| 296 | Rex | played **2♣** | Next player must draw 2 or stack another 2 → your turn | 6 | ✅ |
| 297 | You | accepted the penalty | Drew **2** penalty cards (a 2) → Nova's turn | 9 | ✅ |
| 298 | Nova | played **4♣** | Normal card → Rex's turn | 5 | ✅ |
| 299 | Rex | played **10♣** | Normal card → your turn | 5 | ✅ |
| 300 | You | played **10♥** | Normal card → Nova's turn | 8 | ✅ |
| 301 | Nova | played **A♥** | Normal Ace (no penalty) → Rex's turn | 4 | ✅ |
| 302 | Rex | played **5♥** | Normal card → your turn | 4 | ✅ |
| 303 | You | played **8♥** | Next player is skipped unless they play an 8 → Nova's turn | 7 | ✅ |
| 304 | Nova | played **8♦** | 8 passes the skip on – next player is skipped unless they play an 8 → Rex's turn | 3 | ✅ |
| 305 | Rex | accepted the skip | Skipped – loses the turn, draws nothing → your turn | 4 | ✅ |
| 306 | You | played **9♦** | Normal card → Nova's turn | 6 | ✅ |
| 307 | Nova | played **3♦** | Normal card → Rex's turn | 2 | ✅ |
| 308 | Rex | played **Q♦** | Normal card → your turn | 3 | ✅ |
| 309 | You | played **Q♠** | Normal card → Nova's turn | 5 | ✅ |
| 310 | Nova | played **J♠** and named **Hearts** | Jack wild – suit to follow is now Hearts → Rex's turn | 1 | ✅ |
| 311 | Rex | played **9♥** | Normal card → your turn | 2 | ✅ |
| 312 | You | played **Q♥** | Normal card → Nova's turn | 4 | ✅ |
| 313 | Nova | played **6♥** | Normal card · **last card – out of cards, wins the round** | 0 | ✅ |

**Round 10 won by Nova.** Cards left in hand count as penalty points:

| Player | Cards left | Round points | Total | Status |
|---|---|---|---|---|
| You | 5♣ K♣ 6♦ 4♦ | 25 | 365 | still in |
| Nova | – | 0 | 280 | 🏆 round winner |
| Rex | 2♠ 7♠ | 35 | 450 | still in |

## Round 11

Starting card: **3♣** · first turn: **Nova**

Hands dealt (7 cards each):

- You: Q♥ A♦ 9♥ 9♠ 4♦ 4♠ J♠
- Nova: 2♥ 4♥ Q♦ 10♣ A♠ A♣ 10♦
- Rex: 2♣ J♣ 7♦ 9♦ A♥ J♥ 7♠

| # | Player | Action | Effect | Cards left | Check |
|---|---|---|---|---|---|
| 314 | Nova | played **A♣** | Normal Ace (no penalty) → Rex's turn | 6 | ✅ |
| 315 | Rex | played **2♣** | Next player must draw 2 or stack another 2 → your turn | 6 | ✅ |
| 316 | You | accepted the penalty | Drew **2** penalty cards (a 2) → Nova's turn | 9 | ✅ |
| 317 | Nova | played **2♥** | Next player must draw 2 or stack another 2 → Rex's turn | 5 | ✅ |
| 318 | Rex | accepted the penalty | Drew **2** penalty cards (a 2) → your turn | 8 | ✅ |
| 319 | You | played **2♦** | Next player must draw 2 or stack another 2 → Nova's turn | 8 | ✅ |
| 320 | Nova | accepted the penalty | Drew **2** penalty cards (a 2) → Rex's turn | 7 | ✅ |
| 321 | Rex | played **7♦** | Normal card → your turn | 7 | ✅ |
| 322 | You | played **A♦** | Normal Ace (no penalty) → Nova's turn | 7 | ✅ |
| 323 | Nova | played **A♠** | A♠ – next player must draw 5 or pass it with an Ace → Rex's turn | 6 | ✅ |
| 324 | Rex | played **A♥** | Ace passes the A♠ penalty on – next player must draw 5 or pass it with an Ace → your turn | 6 | ✅ |
| 325 | You | accepted the penalty | Drew **5** penalty cards (A♠) → Nova's turn | 12 | ✅ |
| 326 | Nova | played **4♥** | Normal card → Rex's turn | 5 | ✅ |
| 327 | Rex | played **J♣** and named **Spades** | Jack wild – suit to follow is now Spades → your turn | 5 | ✅ |
| 328 | You | played **9♠** | Normal card → Nova's turn | 11 | ✅ |
| 329 | Nova | played **3♠** | Normal card → Rex's turn | 4 | ✅ |
| 330 | Rex | played **8♠** | Next player is skipped unless they play an 8 → your turn | 4 | ✅ |
| 331 | You | played **8♣** | 8 passes the skip on – next player is skipped unless they play an 8 → Nova's turn | 10 | ✅ |
| 332 | Nova | accepted the skip | Skipped – loses the turn, draws nothing → Rex's turn | 4 | ✅ |
| 333 | Rex | played **7♥** | 7♥ wild – round ends immediately, player wins the round | 3 | ✅ |

**Round 11 won by Rex.** Cards left in hand count as penalty points:

| Player | Cards left | Round points | Total | Status |
|---|---|---|---|---|
| You | Q♥ 9♥ 4♦ 4♠ J♠ 10♥ Q♣ K♦ K♣ 4♣ | 100 | 465 | still in |
| Nova | Q♦ 10♣ 10♦ 5♣ | 35 | 315 | still in |
| Rex | 9♦ J♥ 7♠ | 40 | 490 | 🏆 round winner |

## Round 12

Starting card: **Q♣** · first turn: **Nova**

Hands dealt (7 cards each):

- You: J♣ 10♠ K♦ 5♥ J♦ 4♣ 6♣
- Nova: K♠ 7♣ 2♣ 8♠ J♠ Q♥ 8♦
- Rex: 6♠ 5♦ 6♥ A♥ 10♦ 5♠ K♥

| # | Player | Action | Effect | Cards left | Check |
|---|---|---|---|---|---|
| 334 | Nova | played **2♣** | Next player must draw 2 or stack another 2 → Rex's turn | 6 | ✅ |
| 335 | Rex | accepted the penalty | Drew **2** penalty cards (a 2) → your turn | 9 | ✅ |
| 336 | You | played **4♣** | Normal card → Nova's turn | 6 | ✅ |
| 337 | Nova | played **7♣** | Normal card → Rex's turn | 5 | ✅ |
| 338 | Rex | played **5♣** | Normal card → your turn | 8 | ✅ |
| 339 | You | played **6♣** | Normal card → Nova's turn | 5 | ✅ |
| 340 | Nova | played **J♠** and named **Spades** | Jack wild – suit to follow is now Spades → Rex's turn | 4 | ✅ |
| 341 | Rex | played **6♠** | Normal card → your turn | 7 | ✅ |
| 342 | You | played **10♠** | Normal card → Nova's turn | 4 | ✅ |
| 343 | Nova | played **8♠** | Next player is skipped unless they play an 8 → Rex's turn | 3 | ✅ |
| 344 | Rex | accepted the skip | Skipped – loses the turn, draws nothing → your turn | 7 | ✅ |
| 345 | You | played **J♣** and named **Hearts** | Jack wild – suit to follow is now Hearts → Nova's turn | 3 | ✅ |
| 346 | Nova | played **Q♥** | Normal card → Rex's turn | 2 | ✅ |
| 347 | Rex | played **A♥** | Normal Ace (no penalty) → your turn | 6 | ✅ |
| 348 | You | played **5♥** | Normal card → Nova's turn | 2 | ✅ |
| 349 | Nova | drew a card | No playable card – drew 1, turn ends → Rex's turn | 3 | ✅ |
| 350 | Rex | played **K♥** | Normal card → your turn | 5 | ✅ |
| 351 | You | played **K♦** | Normal card → Nova's turn | 1 | ✅ |
| 352 | Nova | played **8♦** | Next player is skipped unless they play an 8 → Rex's turn | 2 | ✅ |
| 353 | Rex | accepted the skip | Skipped – loses the turn, draws nothing → your turn | 5 | ✅ |
| 354 | You | played **J♦** and named **Spades** | Jack wild – suit to follow is now Spades · **last card – out of cards, wins the round** | 0 | ✅ |

**Round 12 won by You.** Cards left in hand count as penalty points:

| Player | Cards left | Round points | Total | Status |
|---|---|---|---|---|
| You | – | 0 | 465 | 🏆 round winner |
| Nova | K♠ 3♥ | 15 | 330 | still in |
| Rex | 5♦ 6♥ 10♦ 5♠ 3♦ | 30 | 520 | ❌ eliminated (502+) |

## Round 13

Starting card: **Q♣** · first turn: **You**

Hands dealt (7 cards each):

- You: J♠ 4♠ 3♠ K♣ 2♣ 6♠ Q♠
- Nova: Q♥ 8♦ 7♠ 4♣ 10♥ Q♦ 10♠

| # | Player | Action | Effect | Cards left | Check |
|---|---|---|---|---|---|
| 355 | You | played **2♣** | Next player must draw 2 or stack another 2 → Nova's turn | 6 | ✅ |
| 356 | Nova | accepted the penalty | Drew **2** penalty cards (a 2) → your turn | 9 | ✅ |
| 357 | You | played **K♣** | Normal card → Nova's turn | 5 | ✅ |
| 358 | Nova | played **K♦** | Normal card → your turn | 8 | ✅ |
| 359 | You | played **J♠** and named **Spades** | Jack wild – suit to follow is now Spades → Nova's turn | 4 | ✅ |
| 360 | Nova | played **10♠** | Normal card → your turn | 7 | ✅ |
| 361 | You | played **Q♠** | Normal card → Nova's turn | 3 | ✅ |
| 362 | Nova | played **Q♥** | Normal card → your turn | 6 | ✅ |
| 363 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 4 | ✅ |
| 364 | Nova | played **10♥** | Normal card → your turn | 5 | ✅ |
| 365 | You | played **J♥** and named **Spades** | Jack wild – suit to follow is now Spades → Nova's turn | 3 | ✅ |
| 366 | Nova | played **7♠** | Normal card → your turn | 4 | ✅ |
| 367 | You | played **4♠** | Normal card → Nova's turn | 2 | ✅ |
| 368 | Nova | played **4♣** | Normal card → your turn | 3 | ✅ |
| 369 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 3 | ✅ |
| 370 | Nova | drew a card | No playable card – drew 1, turn ends → your turn | 4 | ✅ |
| 371 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 4 | ✅ |
| 372 | Nova | drew a card | No playable card – drew 1, turn ends → your turn | 5 | ✅ |
| 373 | You | played **10♣** | Normal card → Nova's turn | 3 | ✅ |
| 374 | Nova | played **J♣** and named **Diamonds** | Jack wild – suit to follow is now Diamonds → your turn | 4 | ✅ |
| 375 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 4 | ✅ |
| 376 | Nova | played **8♦** | Next player is skipped unless they play an 8 → your turn | 3 | ✅ |
| 377 | You | accepted the skip | Skipped – loses the turn, draws nothing → Nova's turn | 4 | ✅ |
| 378 | Nova | played **Q♦** | Normal card → your turn | 2 | ✅ |
| 379 | You | played **A♦** | Normal Ace (no penalty) → Nova's turn | 3 | ✅ |
| 380 | Nova | played **3♦** | Normal card → your turn | 1 | ✅ |
| 381 | You | played **3♠** | Normal card → Nova's turn | 2 | ✅ |
| 382 | Nova | drew a card | No playable card – drew 1, turn ends → your turn | 2 | ✅ |
| 383 | You | played **6♠** | Normal card → Nova's turn | 1 | ✅ |
| 384 | Nova | drew a card | No playable card – drew 1, turn ends → your turn | 3 | ✅ |
| 385 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 2 | ✅ |
| 386 | Nova | drew a card | No playable card – drew 1, turn ends → your turn | 4 | ✅ |
| 387 | You | played **6♣** | Normal card → Nova's turn | 1 | ✅ |
| 388 | Nova | played **5♣** | Normal card → your turn | 3 | ✅ |
| 389 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 2 | ✅ |
| 390 | Nova | played **5♥** | Normal card → your turn | 2 | ✅ |
| 391 | You | played **2♥** | Next player must draw 2 or stack another 2 → Nova's turn | 1 | ✅ |
| 392 | Nova | played **2♦** | 2 stacked – penalty grows from 2 to 4 cards → your turn | 1 | ✅ |
| 393 | You | accepted the penalty | Drew **4** penalty cards (stacked 2s) → Nova's turn | 5 | ✅ |
| 394 | Nova | drew a card | No playable card – drew 1, turn ends → your turn | 2 | ✅ |
| 395 | You | played **9♦** | Normal card → Nova's turn | 4 | ✅ |
| 396 | Nova | drew a card | No playable card – drew 1, turn ends → your turn | 3 | ✅ |
| 397 | You | played **9♥** | Normal card → Nova's turn | 3 | ✅ |
| 398 | Nova | played **3♥** | Normal card → your turn | 2 | ✅ |
| 399 | You | played **4♥** | Normal card → Nova's turn | 2 | ✅ |
| 400 | Nova | drew a card | No playable card – drew 1, turn ends → your turn | 3 | ✅ |
| 401 | You | played **J♦** and named **Spades** | Jack wild – suit to follow is now Spades → Nova's turn | 1 | ✅ |
| 402 | Nova | played **A♠** | A♠ – next player must draw 5 or pass it with an Ace → your turn | 2 | ✅ |
| 403 | You | accepted the penalty | Drew **5** penalty cards (A♠) → Nova's turn | 6 | ✅ |
| 404 | Nova | played **2♠** | Next player must draw 2 or stack another 2 → your turn | 1 | ✅ |
| 405 | You | accepted the penalty | Drew **2** penalty cards (a 2) → Nova's turn | 8 | ✅ |
| 406 | Nova | drew a card | No playable card – drew 1, turn ends → your turn | 2 | ✅ |
| 407 | You | played **8♠** | Next player is skipped unless they play an 8 → Nova's turn | 7 | ✅ |
| 408 | Nova | played **8♣** | 8 passes the skip on – next player is skipped unless they play an 8 → your turn | 1 | ✅ |
| 409 | You | played **8♥** | 8 passes the skip on – next player is skipped unless they play an 8 → Nova's turn | 6 | ✅ |
| 410 | Nova | accepted the skip | Skipped – loses the turn, draws nothing → your turn | 1 | ✅ |
| 411 | You | played **A♥** | Normal Ace (no penalty) → Nova's turn | 5 | ✅ |
| 412 | Nova | drew a card | No playable card – drew 1, turn ends → your turn | 2 | ✅ |
| 413 | You | played **A♣** | Normal Ace (no penalty) → Nova's turn | 4 | ✅ |
| 414 | Nova | played **3♣** | Normal card → your turn | 1 | ✅ |
| 415 | You | played **7♣** | Normal card → Nova's turn | 3 | ✅ |
| 416 | Nova | drew a card | No playable card – drew 1, turn ends → your turn | 2 | ✅ |
| 417 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 4 | ✅ |
| 418 | Nova | played **7♦** | Normal card → your turn | 1 | ✅ |
| 419 | You | played **10♦** | Normal card → Nova's turn | 3 | ✅ |
| 420 | Nova | drew a card | No playable card – drew 1, turn ends → your turn | 2 | ✅ |
| 421 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 4 | ✅ |
| 422 | Nova | drew a card | No playable card – drew 1, turn ends → your turn | 3 | ✅ |
| 423 | You | played **5♦** | Normal card → Nova's turn | 3 | ✅ |
| 424 | Nova | played **6♦** | Normal card → your turn | 2 | ✅ |
| 425 | You | drew a card | No playable card – drew 1, turn ends → Nova's turn | 4 | ✅ |
| 426 | Nova | played **6♥** | Normal card → your turn | 1 | ✅ |
| 427 | You | played **K♥** | Normal card → Nova's turn | 3 | ✅ |
| 428 | Nova | drew a card | No playable card – drew 1, turn ends → your turn | 2 | ✅ |
| 429 | You | played **K♠** | Normal card → Nova's turn | 2 | ✅ |
| 430 | Nova | played **9♠** | Normal card → your turn | 1 | ✅ |
| 431 | You | played **5♠** | Normal card → Nova's turn | 1 | ✅ |
| 432 | Nova | drew a card | No playable card – drew 1, turn ends → your turn | 2 | ✅ |
| 433 | You | drew a card | No playable card – drew 1 (discard pile reshuffled into a new draw pile), turn ends → Nova's turn | 2 | ✅ |
| 434 | Nova | played **7♥** | 7♥ wild – round ends immediately, player wins the round | 1 | ✅ |

**Round 13 won by Nova.** Cards left in hand count as penalty points:

| Player | Cards left | Round points | Total | Status |
|---|---|---|---|---|
| You | 4♦ A♠ | 105 | 570 | ❌ eliminated (502+) |
| Nova | 9♣ | 5 | 335 | 🏆 round winner |

## 🏆 Game over – Nova wins

| Player | Final total | Result |
|---|---|---|
| You | 570 | eliminated |
| Nova | 335 | WINNER |
| Rex | 520 | eliminated |

**Play again** → new game started: Round 1, all scores 0, everyone dealt 7 cards ✅
