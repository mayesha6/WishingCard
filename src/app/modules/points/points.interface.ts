import { Types } from "mongoose";

export interface IPointsTransaction {
  _id?: Types.ObjectId;
  senderEmail: string;       
  receiverEmail: string;     
  points: number;           
  description?: string;     
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserPoints {
  email: string;
  totalPoints: number;
}