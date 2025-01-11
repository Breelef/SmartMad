import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import your models
import AIResponse from "../mongoDB/models/AIResponse.js";
import Ingredient from "../mongoDB/models/Ingredient.js";
import Instruction from "../mongoDB/models/Instruction.js";
import Recipe from "../mongoDB/models/Recipe.js";
import RecipeIngredient from "../mongoDB/models/RecipeIngredient.js";
import ModificationResponse from "../mongoDB/models/ModificationResponse.js";
import User from "../mongoDB/models/User.js";
import UserPrompt from "../mongoDB/models/UserPrompt.js";

// Load environment variables from .env file
dotenv.config();

// MongoDB connection setup
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout in 5 seconds if MongoDB is unreachable
      socketTimeoutMS: 45000,         // Timeout in 45 seconds for queries
    });
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process if the connection fails
  }
};

// Call the connection function to establish the MongoDB connection
connectMongo();

// Model Service functions
const modelService = {
  //AIResponse
  createAIResponse: async (data) => await AIResponse.create(data),
  getAIResponseById: async (id) => await AIResponse.findById(id),
  updateAIResponse: async (id, data) =>
    await AIResponse.findByIdAndUpdate(id, data, { new: true }),
  deleteAIResponse: async (id) => await AIResponse.findByIdAndDelete(id),

  //Ingredient
  createIngredient: async (data) => await Ingredient.create(data),
  getIngredientById: async (id) => await Ingredient.findById(id),
  getAllIngredients: async () => await Ingredient.find(),
  updateIngredient: async (id, data) =>
    await Ingredient.findByIdAndUpdate(id, data, { new: true }),
  deleteIngredient: async (id) => await Ingredient.findByIdAndDelete(id),

  //Instruction
  createInstruction: async (data) => await Instruction.create(data),
  getInstructionById: async (id) => await Instruction.findById(id),
  getInstructionsByRecipeId: async (recipeId) =>
    await Instruction.find({ recipe_id: recipeId }),
  updateInstruction: async (id, data) =>
    await Instruction.findByIdAndUpdate(id, data, { new: true }),
  deleteInstruction: async (id) => await Instruction.findByIdAndDelete(id),

  //ModificationResponse
  createModificationResponse: async (data) =>
    await ModificationResponse.create(data),
  getModificationResponseById: async (id) =>
    await ModificationResponse.findById(id),
  getModificationResponsesByAIResponseId: async (aiResponseId) =>
    await ModificationResponse.find({ ai_response_id: aiResponseId }),
  updateModificationResponse: async (id, data) =>
    await ModificationResponse.findByIdAndUpdate(id, data, { new: true }),
  deleteModificationResponse: async (id) =>
    await ModificationResponse.findByIdAndDelete(id),

  //UserPrompt
  createUserPrompt: async (data) => await UserPrompt.create(data),
  getUserPromptById: async (id) =>
    await UserPrompt.findById(id)
      .populate("aiResponse")
      .populate("modifications"),
  getUserPromptsByUserId: async (userId) =>
    await UserPrompt.find({ user_id: userId }),
  updateUserPrompt: async (id, data) =>
    await UserPrompt.findByIdAndUpdate(id, data, { new: true }),
  deleteUserPrompt: async (id) => await UserPrompt.findByIdAndDelete(id),

  //Recipe
  createRecipe: async (data) => await Recipe.create(data),
  getRecipeById: async (id) =>
    await Recipe.findById(id)
      .populate("instructions")
      .populate("recipe_ingredients")
      .populate("modifications")
      .populate("users"),
  getAllRecipes: async () => await Recipe.find(),
  updateRecipe: async (id, data) =>
    await Recipe.findByIdAndUpdate(id, data, { new: true }),
  deleteRecipe: async (id) => await Recipe.findByIdAndDelete(id),

  //User
  createUser: async (data) => await User.create(data),
  getUserById: async (id) =>
    await User.findById(id).populate("prompts").populate("recipes"),
  getAllUsers: async () => await User.find(),
  updateUser: async (id, data) =>
    await User.findByIdAndUpdate(id, data, { new: true }),
  deleteUser: async (id) => await User.findByIdAndDelete(id),

  //Misc

  //Get recipes based on user id
  getUserRecipes: async (userId) =>
    await Recipe.find({ users: userId }).populate("recipe_ingredients"),

  // Get all recipes by a user's prompts
  getRecipesByUserPrompts: async (userId) => {
    const prompts = await UserPrompt.find({ user_id: userId });
    const recipes = [];
    for (const prompt of prompts) {
      const aiResponse = await AIResponse.findOne({
        user_prompt_id: prompt._id,
      });
      if (aiResponse) {
        const recipe = await Recipe.findOne({ ai_response_id: aiResponse._id });
        if (recipe) recipes.push(recipe);
      }
    }
    return recipes;
  },

  // Get all ingredients for a recipe
  getAllIngredientsForRecipe: async (recipeId) => {
    const recipeIngredients = await RecipeIngredient.find({
      recipe_id: recipeId,
    }).populate("ingredient_id");
    return recipeIngredients.map((ri) => ({
      ingredient: ri.ingredient_id,
      value: ri.value,
      unit: ri.unit,
      comment: ri.comment,
    }));
  },

  // Bulk create instructions for a recipe
  bulkCreateInstructions: async (recipeId, instructions) =>
    await Instruction.insertMany(
      instructions.map((step) => ({ recipe_id: recipeId, ...step }))
    ),

  // Get users linked to a recipe
  getUsersLinkedToRecipe: async (recipeId) =>
    await User.find({ recipes: recipeId }),
};

export default modelService;
