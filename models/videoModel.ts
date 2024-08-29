import mongoose, { Schema, Document } from "mongoose";

export interface VideoModel extends Document {
  url?: string;
  playlist?: string[];
}

const videoSchema: Schema = new Schema({
  url: {
    type: String,
  },
  playlist: {
    type: [String],
  },
});

export default mongoose.model<VideoModel>("Video", videoSchema);
