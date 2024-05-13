import mongoose, { Schema, Document } from 'mongoose';

interface IGame extends Document {
  cards: { symbol: string; position: string; matched: boolean }[];
  status: 'ongoing' | 'won';
  attempts: { card1: string; card2: string }[];
  endTime?: Date;
}

const gameSchema: Schema = new Schema({
  cards: [{ symbol: String, position: String, matched: Boolean }],
  status: { type: String, enum: ['ongoing', 'won'], default: 'ongoing' },
  attempts: [{ card1: String, card2: String }],
  endTime: Date
});

export default mongoose.model<IGame>('Game', gameSchema);
