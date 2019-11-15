import mongoose, { Document, Schema } from 'mongoose';
import { Role } from '../role/model';

export interface Activity{
    _id: any,
    name: string,
    startDate: Date,
    endDate: Date,
    place: string,
    participants: Map<string, string>,
    description: string
}

export interface ActivityDocument extends Activity, Document {}

const schema = new Schema(
    {
      name: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      place: {type: String, required: true},
      participants: {type: Map, of: String, ref:'roles', required: false},
      description: { type: String, required: false },
    },
    { _id: true, timestamps: true }
  );
  
  export const model = mongoose.model<ActivityDocument>('activities', schema);
  