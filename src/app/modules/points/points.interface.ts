import { Types } from "mongoose";

export interface IPointsTransaction {
  _id?: Types.ObjectId;
  senderEmail: string;       // যিনি point পাঠাচ্ছেন
  receiverEmail: string;     // যিনি point পাচ্ছেন
  points: number;            // কত point পাঠানো হলো
  description?: string;      // optional, recognition note
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserPoints {
  email: string;
  totalPoints: number;
}