import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  businessID: { type: String,unique: true},
  businessStatus: {
    open: { type: Boolean, default: true },
    blocked: { type: Boolean, default: false },
    verified: { type: Boolean, default: true },
    holiday: {
      days: {
        sunday: { type: Boolean, default: false },
        monday: { type: Boolean, default: false },
        tuesday: { type: Boolean, default: false },
        wednesday: { type: Boolean, default: false },
        thrusday: { type: Boolean, default: false },
        friday: { type: Boolean, default: false },
        saturday: { type: Boolean, default: false },
        }
    },
  },
  businessInfo: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phoneNo: { type: Number, required: true },
    email: { type: String, required: true },
    gstNo: { type: String},
    location: {
      longitude: { type: Number, required: true },
      lattitude: { type: Number, required: true }
    },
  },
  businessHours: {
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    breakStart: { type: String },
    breakEnd: { type: String },
  },
  
  slot: {
    gameLength: { type: String, required: true },
    customGameLength: {type: Boolean, default: true } 
  },
  bookingType: {
    single: {type: Boolean, default: true },
    multiple: {type: Boolean, default: true }, 
    team: { type: Boolean, default: true },
    TimeRanges: { type: Boolean, default: true }
  }
});

export const BusinessSetup = mongoose.model('BusinessConfig', businessSchema);