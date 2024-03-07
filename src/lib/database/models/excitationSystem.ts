import { Schema, model, models } from "mongoose";

export interface IExcitationSystem extends Document {
  _id: string;
  deviceName: string;
  AVRType: string;
  generatorDeviceName: string;
  AVRImage: string;
  PSSImage: string;
  UELImage: string;
  OELImage: string;
  additionalFields: Record<string, any>;
  [key: string]: any;
}

const excitationSystemSchema = new Schema({
  deviceName: {
    type: String,
    required: true,
  },
  AVRType: {
    type: String,
    required: true,
  },
  generatorDeviceName: {
    type: String,
    required: true,
  },
  AVRImage: {
    type: String,
    required: true,
  },
  PSSImage: {
    type: String,
    required: true,
  },
  UELImage: {
    type: String,
    required: true,
  },
  OELImage: {
    type: String,
    required: true,
  },
  additionalFields: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

const ExcitationSystem = models.ExcitationSystem || model("ExcitationSystem", excitationSystemSchema);

export default ExcitationSystem;
