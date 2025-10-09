import mongoose from 'mongoose';

export function isPersistenceEnabled() {
  return mongoose.connection.readyState === 1;
}
