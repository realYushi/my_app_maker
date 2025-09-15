import mongoose, { Schema, Document } from 'mongoose';

export interface IGenerationFailure extends Document {
  timestamp: Date;
  userInput: string;
  errorSource: string;
  errorMessage: string;
  llmResponseRaw?: any;
}

const GenerationFailureSchema: Schema = new Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  userInput: {
    type: String,
    required: true,
    maxlength: 10000
  },
  errorSource: {
    type: String,
    required: true,
    enum: ['validation', 'llm_api', 'parsing', 'timeout', 'network', 'unknown']
  },
  errorMessage: {
    type: String,
    required: true,
    maxlength: 1000
  },
  llmResponseRaw: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  }
}, {
  timestamps: true,
  collection: 'generation_failures'
});

GenerationFailureSchema.index({ timestamp: -1 });
GenerationFailureSchema.index({ errorSource: 1 });

export const GenerationFailure = mongoose.model<IGenerationFailure>('GenerationFailure', GenerationFailureSchema);