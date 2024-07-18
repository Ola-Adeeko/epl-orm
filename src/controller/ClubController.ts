import { Request, Response, NextFunction } from "express";
import { Club } from "../entity/Club";
import { AppDataSource } from "../data-source";
import CustomError from "../Errors/customErrors";
import { body } from "express-validator";
import { Player } from "../entity/Player";

const clubRepository = AppDataSource.getRepository(Club);
const playerRepository = AppDataSource.getRepository(Player);

const checkClubExistsById = async (clubId: number) => {
  try {
    if (!clubId) throw new CustomError("Invalid club ID provided", 400);

    const clubExists = await clubRepository.exists({ where: { id: clubId } });

    return !!clubExists;
  } catch (err) {
    throw new CustomError("Error checking club existence", 500);
  }
};

export const validateClubRules = () => {
  return [
    body("name").notEmpty().withMessage("club name cannot be empty"),
    body("owner").notEmpty().withMessage("club owner cannot be empty"),
    body("manager").notEmpty().withMessage("club manager cannot be empty"),
  ];
};

export const getExistingClub = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { clubId } = req.params;
  const clubIdNum = parseInt(clubId, 10);

  try {
    if (!(await checkClubExistsById(clubIdNum))) {
      throw new CustomError("Club not found", 404);
    }

    const club = await clubRepository.findOneBy({ id: clubIdNum });
    req.club = club;
    next();
  } catch (err) {
    next(err);
  }
};

// Get all clubs
export const getAllClubs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clubs = await clubRepository.find();

    res.status(200).json({
      status: true,
      message: "clubs fetched successfully",
      data: clubs,
    });
  } catch (err) {
    next(err);
  }
};

//Create Club
export const createClub = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, manager, owner } = req.body;

  try {
    const clubIsExisting = await clubRepository.findOneBy({
      name: name,
    });

    if (!!clubIsExisting) throw new CustomError("Club already exists", 400);

    const newClub = clubRepository.create({
      name: name,
      manager: manager,
      owner: owner,
    });

    await clubRepository.save(newClub);

    res.status(200).json({
      status: true,
      message: `Successfully added club`,
      data: newClub,
    });
  } catch (err) {
    next(err);
  }
};

// Get Single Club by Id
export const getClubById = async (req: Request, res: Response) => {
  const { club } = req;

  res.status(200).json({
    status: true,
    message: `club fetched successfully`,
    data: club,
  });
};

export const validatePatchClub = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, manager, owner } = req.body;

  if (!name && !manager && !owner) {
    return next(
      new CustomError(
        "At least one field (name, manager, owner) must be provided",
        400
      )
    );
  }
  next();
};

// patch club data
export const patchClubById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    club,
    body,
    params: { clubId },
  } = req;
  const clubIdNum = parseInt(clubId, 10);

  club.name = body?.name || club.name;
  club.manager = body?.manager || club.manager;
  club.owner = body?.owner || club.owner;
  try {
    await clubRepository.update(clubIdNum, club);

    res.status(200).json({
      status: true,
      message: `Successfully updated club`,
      data: club,
    });
  } catch (err) {
    next(err);
  }
};

// update club data
export const updateClubById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { name, manager, owner },
    params: { clubId },
  } = req;
  const clubIdNum = parseInt(clubId, 10);

  try {
    if (!name) throw new CustomError("club name cannot be empty", 400);
    if (!owner) throw new CustomError("Club owner cannot be empty", 400);
    if (!manager) throw new CustomError("Club manager cannot be empty", 400);

    const club = await clubRepository.findOneBy({ id: clubIdNum });

    club.name = name;
    club.owner = owner;
    club.manager = manager;

    await clubRepository.update(clubIdNum, club);
    res.status(200).json({
      status: true,
      message: `Successfully updated club`,
      data: club,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Single Club by Id
export const deleteClubById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { clubId },
    club,
  } = req;
  const clubIdNum = parseInt(clubId, 10);
  try {
    await clubRepository.delete(clubIdNum);

    res.status(200).json({
      status: true,
      message: `Successfully deleted club`,
      data: club,
    });
  } catch (err) {
    next(err);
  }
};

// Get  Club Players by Id
export const getClubPlayers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { clubId } = req.params;
  const clubIdNum = parseInt(clubId, 10);

  try {
    const players = await playerRepository.findBy({ club: { id: clubIdNum } });

    res.status(200).json({
      status: true,
      message: `Successfully fetched club players`,
      data: players,
    });
  } catch (err) {
    next(err);
  }
};
