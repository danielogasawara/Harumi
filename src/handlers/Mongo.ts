import mongoose from 'mongoose';
import { color } from '../functions';

module.exports = () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI)
    return console.log(
      color(
        'text',
        `🍃 Mongo URI não encontrada, ${color('error', 'ignorando.')}`
      )
    );
  mongoose
    .connect(`${MONGO_URI}/${process.env.MONGO_DATABASE_NAME}`)
    .then(() =>
      console.log(
        color(
          'text',
          `🍃 MongoDB conexão ${color('variable', 'estabelecida.')}`
        )
      )
    )
    .catch(() =>
      console.log(
        color('text', `🍃 MongoDB conexão ${color('error', 'falhou.')}`)
      )
    );
};
