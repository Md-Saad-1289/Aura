import mongoose, { Schema } from 'mongoose';

export interface ISetting {
  key: string;
  value: any;
  updatedAt: string;
}

const SettingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true },
    updatedAt: { type: String, default: () => new Date().toISOString() },
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

export const SettingModel: mongoose.Model<any> =
  mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
