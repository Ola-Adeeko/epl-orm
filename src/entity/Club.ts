import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Player } from "./Player";

@Entity()
export class Club {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  manager: string;

  @Column()
  owner: string;

  @OneToMany(() => Player, (player) => player.club)
  players: Player[];
}
