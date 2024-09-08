import mongoose, { Schema, Document } from 'mongoose';

export interface IChannel extends Document {
    name: string;
    owner: mongoose.Types.ObjectId; // استفاده از نوع ObjectId برای مالک کانال
    members: mongoose.Types.ObjectId[]; // لیستی از ObjectIdها برای اعضای کانال
}

const ChannelSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // مرجع به مدل User
    members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }], // لیستی از کاربران
});

export default mongoose.model<IChannel>('Channel', ChannelSchema);