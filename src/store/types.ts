import {ApiState} from "@/store/api/types";
import {LoginState} from "@/store/login/types";
import {AccountState} from "@/store/account/types";
import {ChallengesState} from "@/store/challenges/types";

export interface RootState {
    api: ApiState,
    login: LoginState,
    account: AccountState,
    challenges: ChallengesState,
}