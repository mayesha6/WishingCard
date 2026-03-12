import { PointsTransaction } from "./points.model";
import { IPointsTransaction } from "./points.interface";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const createTransaction = async (data: IPointsTransaction) => {
    const { senderEmail, receiverEmail, points } = data;

    const sender = await User.findOne({ email: senderEmail });
    if (!sender) throw new AppError(httpStatus.NOT_FOUND, "Sender not found");

    if (sender.pointsBalance < points) {
        throw new AppError(httpStatus.BAD_REQUEST, "Insufficient points");
    }

    const receiver = await User.findOne({ email: receiverEmail });
    if (!receiver) throw new AppError(404, "Receiver not found");

    sender.pointsBalance -= points;
    receiver.pointsBalance += points;

    await sender.save();
    await receiver.save();

    const transaction = await PointsTransaction.create(data);
    return transaction;
}

const getUserTransactions = async (email: string) => {
    return await PointsTransaction.find({
        $or: [{ senderEmail: email }, { receiverEmail: email }]
    }).sort({ createdAt: -1 });
}

const getUserBalance = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
    return user.pointsBalance;
}

export const PointsService = {
    createTransaction,
    getUserTransactions,
    getUserBalance
};