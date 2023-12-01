import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Vehicle } from './Vehicle';
import { User } from './User';
import { Appointment } from './Appointment';

@Entity()
export class Offer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: string;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => Appointment, (appointment) => appointment.offer)
  appointment: Appointment;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
