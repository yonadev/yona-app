import {ApiState} from "@/store/api/types";
import {LoginState} from "@/store/login/types";
import {AccountState} from "@/store/account/types";
import {ChallengesState} from "@/store/challenges/types";
import {BuddiesState} from "@/store/buddies/types";

export interface RootState {
    api: ApiState,
    login: LoginState,
    account: AccountState,
    challenges: ChallengesState,
    buddies: BuddiesState,
}