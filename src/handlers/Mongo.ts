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
    .connect(
      `${MONGO_URI}/${process.env.MONGO_DATABASE_NAME}?retryWrites=true&w=majority`
    )
    .then(() =>
      console.log(
        color(
          'text',
          `🍃 MongoDB a conexão foi ${color('variable', 'estabelecida.')}`
        )
      )
    )
    .catch(() =>
      console.log(
        color('text', `🍃 MongoDB a conexão ${color('error', 'falhou.')}`)
      )
    );
};
