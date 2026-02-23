import mongoose from "mongoose";

const favoriteIdeaSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
  generatedName: {
    type: String,
    required: true,
  },
});

const FavoriteIdea = mongoose.model("FavoriteIdea", favoriteIdeaSchema);
export default FavoriteIdea;
