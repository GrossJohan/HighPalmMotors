import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Offer } from './Offer';

@Entity()
export class Vehicle extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'bigint' })
  vin: bigint;

  @Column({ type: 'bigint' })
  year: bigint;

  @Column({ type: 'varchar', length: 50 })
  make: string;

  @Column({ type: 'varchar', length: 50 })
  model: string;

  @Column({ type: 'varchar', length: 50 })
  accident: string;

  @Column({ type: 'varchar', length: 50 })
  issue: string;

  @Column({ type: 'varchar', length: 50 })
  clearTitle: string;

  @Column({ type: 'bigint' })
  odometer: bigint;

  @ManyToOne(() => User, (user) => user.vehicles)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Offer, (offer) => offer.vehicle)
  @JoinColumn({ name: 'offerId' })
  offer: Offer;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
