import { User } from "src/app/services/gestionUser/models";


export class RewardPoints{
    id!: number;
    points!: number;
    valid_until!: Date;
    updated_at!: Date;
    is_active!: boolean;
    value!: number;
    token!: string;
    token_applied!: boolean;
    user!:User
}