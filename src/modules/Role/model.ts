import mongoose, { Document, Schema } from "mongoose";

export interface Role {
  _id: any;
  name: string;
  description: string;
}

export interface RoleDocument extends Role, Document {}

const schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false }
  },
  { _id: true, timestamps: true }
);

export const model = mongoose.model<RoleDocument>("roles", schema);
