import { Request, Response } from 'express';
import Game from '../models/gameModel';


export const healthCheck = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Server is running and healthy' });
};

export const startNewGame = async (req: Request, res: Response) => {
  try {
    const symbols = ['Cat', 'Dog', 'Cow', 'Sheep', 'Horse', 'Pig', 'Fish', 'Bird'];

    const cards = [];
    for (let i = 0; i < symbols.length; i++) {
      cards.push({ symbol: symbols[i], position: '', matched: false });
      cards.push({ symbol: symbols[i], position: '', matched: false });
    }

    const shuffledCards = shuffle(cards);

    const rows = ['1', '2', '3', '4'];
    const columns = ['A', 'B', 'C', 'D'];
    let index = 0;
    for (let row = 0; row < rows.length; row++) {
      for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        const column = columns[columnIndex];
        shuffledCards[index].position = `${column}${rows[row]}`;
        index++;
      }
    }

    const newGame = new Game({ cards: shuffledCards });
 
    await newGame.save();
    res.status(200).json({ message: 'New game started', gameId: newGame._id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};



export const submitCards = async (req: Request, res: Response) => {
  try {
    const { gameId, card1Position, card2Position } = req.body;

    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.endTime) {
      return res.status(400).json({ message: 'Game is already completed' });
    }

    const card1 = game.cards.find(card => card.position === card1Position);
    const card2 = game.cards.find(card => card.position === card2Position);

    if (!card1 || !card2) {
      return res.status(400).json({ message: 'One or both card positions do not exist' });
    }

    if (card1.matched || card2.matched) {
      return res.status(400).json({ message: 'One or both cards are already matched' });
    }

    game.attempts.push({ card1: card1Position, card2: card2Position });

    if (card1.symbol === card2.symbol) {
      card1.matched = true;
      card2.matched = true;
      game.status = 'won'; 
      game.endTime = new Date();

      await game.save();

      return res.status(200).json({ message: 'Cards matched', game });
    } else {
      await game.save();
      return res.status(200).json({ message: 'Cards do not match', game });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const leaderboard = await Game.find({ endTime: { $exists: true } })
      .sort({ attempts: 1, endTime: 1 }) 
      .limit(5); 

    res.status(200).json(leaderboard);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

