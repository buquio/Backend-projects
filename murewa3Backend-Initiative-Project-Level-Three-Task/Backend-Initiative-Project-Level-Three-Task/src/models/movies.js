const mongoose =require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    genre : { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    },
  },
  { timestamps: true }
);

const Movies = mongoose.model('Movies', movieSchema);
module.exports = Movies;
