import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Club } from "./Club";

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "int" })
  age: number;

  @Column({ type: "int" })
  number: number;

  @Column({ type: "varchar" })
  country: string;

  @ManyToOne(() => Club, (club) => club.players)
  club: Club;
}
