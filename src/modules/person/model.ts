import mongoose, { Document, Schema } from "mongoose";

export interface Person {
  _id: any;
  name: string;
  friends: Person[];
}

export interface PersonDocument extends Person, Document {}

const schema = new Schema(
  {
    name: { type: String, required: true },
    friends: [{ type: Schema.Types.ObjectId, ref: "people", required: false }]
  },
  { _id: true, timestamps: true }
);

export const model = mongoose.model<PersonDocument>("people", schema);
