import { Schema, model, Document } from 'mongoose';

export interface INote extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  content: string;
}

const noteSchema = new Schema<INote>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export default model<INote>('Note', noteSchema);