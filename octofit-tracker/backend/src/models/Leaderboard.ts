import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILeaderboardEntry extends Document {
  user: Types.ObjectId;
  team: Types.ObjectId;
  points: number;
  activitiesCompleted: number;
  rank: number;
  createdAt: Date;
  updatedAt: Date;
}

const LeaderboardSchema = new Schema<ILeaderboardEntry>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    points: { type: Number, default: 0 },
    activitiesCompleted: { type: Number, default: 0 },
    rank: { type: Number },
  },
  { timestamps: true }
);

export const Leaderboard = mongoose.model<ILeaderboardEntry>(
  'Leaderboard',
  LeaderboardSchema
);
