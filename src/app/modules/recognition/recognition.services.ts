import httpStatus from "http-status-codes"
import { Recognition } from "./recognition.model"
import { User } from "../user/user.model"
import AppError from "../../errorHelpers/AppError"

const sendRecognition = async (senderEmail: string, payload: any) => {

  const { receiverEmail, category, tone, value, points, message } = payload

  if (senderEmail === receiverEmail) {
    throw new AppError(400, "You cannot send recognition to yourself")
  }

  const sender = await User.findOne({ email: senderEmail })

  if (!sender) {
    throw new AppError(httpStatus.NOT_FOUND, "Sender not found")
  }

  const receiver = await User.findOne({ email: receiverEmail })

  if (!receiver) {
    throw new AppError(httpStatus.NOT_FOUND, "Receiver not found")
  }

  if (sender.pointsBalance < points) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Not enough points"
    )
  }

  // deduct sender points
  sender.pointsBalance -= points

  // add receiver points
  receiver.pointsBalance += points

  await sender.save()
  await receiver.save()

  const recognition = await Recognition.create({
    senderEmail,
    receiverEmail,
    category,
    tone,
    value,
    points,
    message,
    status: "SENT"
  })

  return recognition
}

export const RecognitionServices = {
  sendRecognition
}