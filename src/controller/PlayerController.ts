import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { AppDataSource } from "../data-source";
import CustomError from "../Errors/customErrors";
import { Player } from "../entity/Player";

const playerRepository = AppDataSource.getRepository(Player);

export const checkPlayerExistsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { playerId } = req.params;

  const playerIdNum = parseInt(playerId, 10);
  try {
    if (!playerId) throw new CustomError("Invalid player id", 400);

    const playerExists = await playerRepository.findOneBy({ id: playerIdNum });

    if (!playerExists) throw new CustomError("Player not found", 404);

    req.player = playerExists;
    next();
  } catch (err) {
    next(err);
  }
};

export const validatePlayerRules = () => {
  return [
    body("name").notEmpty().withMessage("Player name cannot be empty"),
    body("age").notEmpty().withMessage("Player age cannot be empty"),
    body("number").notEmpty().withMessage("Player number cannot be empty"),
    body("country").notEmpty().withMessage("Player country cannot be empty"),
    body("club").notEmpty().withMessage("Player club cannot be empty"),
  ];
};

// Validation result handler middleware
export const validatePlayer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;

  try {
    const playerIsExisting = await playerRepository.existsBy({ name: name });

    if (!!playerIsExisting) {
      throw new CustomError("Player already exists", 400);
    }

    next();
  } catch (err) {
    next(err);
  }
};

// Get All Players
export const getAllPlayers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const players = await playerRepository.find();

    res.status(200).json({
      status: true,
      message: "players fetched successfully",
      data: players,
    });
  } catch (err) {
    next(err);
  }
};

// Create Player
export const createPlayer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, age, number, country, club } = req.body;

  try {
    const newPlayer = playerRepository.create({
      name,
      age,
      number,
      country,
      club,
    });

    await playerRepository.save(newPlayer);

    res.status(200).json({
      status: true,
      message: `Successfully added player`,
      data: newPlayer,
    });
  } catch (err) {
    next(err);
  }
};

// Get Single Player by Id
export const getPlayerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { player } = req;

  res.status(200).json({
    status: true,
    message: `Successfully fetched player`,
    data: player,
  });
};

// patch player detail
export const patchPlayerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    player,
    params: { playerId },
    body,
  } = req;

  const { name, age, number, country, club } = body;
  const playerIdNum = parseInt(playerId, 10);

  player.name = name || player.name;
  player.age = age || player.age;
  player.number = number || player.number;
  player.country = country || player.country;
  player.club = club || player.club;

  try {
    await playerRepository.update(playerIdNum, player);

    res.status(200).json({
      status: true,
      message: `Successfully updated player`,
      data: player,
    });
  } catch (err) {
    next(err);
  }
};

// update player detail
export const updatePlayerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { name, age, number, country, club },
    params: { playerId },
  } = req;
  const playerIdNum = parseInt(playerId, 10);
  try {
    if (!name) throw new CustomError("Player name cannot be empty", 400);
    if (!age) throw new CustomError("Player age cannot be empty", 400);
    if (!number) throw new CustomError("Player number cannot be empty", 400);
    if (!country) throw new CustomError("Player country cannot be empty", 400);
    if (!club) throw new CustomError("Player club cannot be empty", 400);

    const player = await playerRepository.findOneBy({ id: playerIdNum });

    player.name = name;
    player.age = age;
    player.number = number;
    player.country = country;
    player.club = club;

    await playerRepository.save(player);
    res.status(200).json({
      status: true,
      message: `Successfully updated player`,
      data: player,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Single Player by Id
export const deletePlayerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    player,
    params: { playerId },
  } = req;

  const playerIdNum = parseInt(playerId, 10);
  try {
    await playerRepository.delete(playerIdNum);
    res.status(200).json({
      status: true,
      message: `Successfully deleted player`,
      data: player,
    });
  } catch (error) {
    next(error);
  }
};
