import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
});

const emailModel=mongoose.models.Email || mongoose.model('Email',emailSchema)
export default emailModel