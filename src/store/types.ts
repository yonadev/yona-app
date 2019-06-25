import {LinksState} from "@/store/links/types";
import {LoginState} from "@/store/login/types";
import {AccountState} from "@/store/account/types";
import {HeaderState} from "@/store/header/types";
import {ChallengesState} from "@/store/challenges/types";

export interface RootState {
    links: LinksState,
    login: LoginState,
    account: AccountState,
    header: HeaderState,
    challenges: ChallengesState,
}