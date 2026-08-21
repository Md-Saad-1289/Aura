import mongoose, { Schema } from 'mongoose';

export interface IActivity {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
  timestamp: string;
  ip: string;
}

const ActivitySchema = new Schema<IActivity>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userRole: { type: String, default: 'user' },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String },
    details: { type: String, required: true },
    timestamp: { type: String, default: () => new Date().toISOString() },
    ip: { type: String, default: '127.0.0.1' },
  },
  {
    toJSON: {
      transform(_doc, ret: any) {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const ActivityModel: mongoose.Model<any> =
  mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
