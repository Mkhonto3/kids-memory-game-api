# Memory Game API

This is a RESTful API built with Express.js for managing a memory card game. The game functionality includes starting a new game, submitting card selections, and retrieving the leaderboard.

## Setup

To set up the project, follow these steps

1. Clone the repository
   ```bash
   git clone <repository-url>

2. Navigate to the project directory
   `cd memory-game-api`

3. Install dependencies
   `npm install`

4. Start the server
   `npm start`

### Endpoints
GET /api/game/health: Check if the server is running and healthy.
POST /api/game/start: Start a new game.
POST /api/game/submit-cards: Submit card selections for matching.
GET /api/game/leaderboard: Get the leaderboard of completed games.



## Start New Game

### Request

POST /api/game/start
Content-Type: application/json

### Response

`json {
  "message": "New game started",
  "gameId": "<game-id>"
}`

## Submit Cards

### Request

POST /api/game/submit-cards
Content-Type: application/json

### Response

`
{
  "message": "Cards matched",
  "game": { "<game-details>" }
}
`

# Get Leaderboard
### Request

GET /api/game/leaderboard


# Response
`[
  { "<game-details>" },
  { "<game-details>" },
  ...
]
`