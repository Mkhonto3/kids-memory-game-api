const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
import app from "../../src/app";

app.use(express.json());

describe('Game API', () => {
  let gameId;

  beforeAll(async () => {
    const response = await request(app).post('/api/game/start');
    gameId = response.body.gameId;
    console.log('gameid: ', gameId);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/game/submit-cards', () => {
    it('should return 404 if game ID does not exist', async () => {
      const response = await request(app)
        .post('/api/game/submit-cards')
        .send({ gameId: 'invalidGameId', card1Position: 'A1', card2Position: 'A2' });
      expect(response.status).toBe(404);
    });

    it('should return 400 if one or both card positions do not exist', async () => {
      const response = await request(app)
        .post('/api/game/submit-cards')
        .send({ gameId, card1Position: 'A1', card2Position: 'A5' });
      expect(response.status).toBe(400); 
    });

    it('should return 400 if one or both cards are already matched', async () => {
      const response = await request(app)
        .post('/api/game/submit-cards')
        .send({ gameId, card1Position: 'A1', card2Position: 'A2' });
      expect(response.status).toBe(400); 
    });

    it('should return 200 with "Cards matched" message if cards match', async () => {
      const response = await request(app)
        .post('/api/game/submit-cards')
        .send({ gameId, card1Position: 'A1', card2Position: 'A3' });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Cards matched');
    });

    it('should return 200 with "Cards do not match" message if cards do not match', async () => {
      const response = await request(app)
        .post('/api/game/submit-cards')
        .send({ gameId, card1Position: 'A1', card2Position: 'B1' });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Cards do not match');
    });
  });
});
