import mongoose, { Schema, Document } from "mongoose";

export interface AnnouncementModel extends Document {
  headline: string;
}

const announcementSchema: Schema = new Schema({
  headline: {
    type: String,
    required: true,
  },
});

export default mongoose.model<AnnouncementModel>("Announcement", announcementSchema);
