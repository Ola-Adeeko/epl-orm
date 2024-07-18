import * as express from "express";
import {
  createClub,
  deleteClubById,
  getAllClubs,
  getClubById,
  getClubPlayers,
  getExistingClub,
  patchClubById,
  updateClubById,
  validateClubRules,
  validatePatchClub,
} from "../controller/ClubController";
import { handleValidationErrors } from "../middleware/validationError";

const router = express.Router();

// Get ALL Clubs
router.get("/", getAllClubs);

// Create Club
router.post("/", validateClubRules(), handleValidationErrors, createClub);

// Get Single Club by Id
router.get("/:clubId", getExistingClub, getClubById);

// Patch Club by Id
router.patch("/:clubId", getExistingClub, validatePatchClub, patchClubById);

// Update Club by Id
router.put("/:clubId", getExistingClub, validatePatchClub, updateClubById);

// Delete Single Club by Id
router.delete("/:clubId", getExistingClub, deleteClubById);

// Get  Club Players by Id
router.get("/:clubId/players", getExistingClub, getClubPlayers);

export default router;
