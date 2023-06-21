const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    content: {
      type: String,
      required: true
    },
    user:
    {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    doctor:
    {
        type:Schema.Types.ObjectId,
        ref:'Doctor'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notes', noteSchema);
