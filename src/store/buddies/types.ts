import { Goal } from "@/store/challenges/types";

export enum userStatus {
  NotRequested = "NOT_REQUESTED",
  Requested = "REQUESTED",
  Accepted = "ACCEPTED",
  Rejected = "REJECTED"
}

export interface Buddy {
  sendingStatus: userStatus;
  receivingStatus: userStatus;
  lastStatusChangeTime: string;
  _embedded: {
    "yona:user": {
      firstName: string;
      lastName: string;
      mobileNumber: string;
      nickname: string;
      creationTime: string;
      appLastOpenedDate: string;
      _links: {
        self: {
          href: string;
        };
        "yona:userPhoto"?: {
          href: string;
        };
      };
      _embedded: {
        "yona:goals": {
          _embedded: {
            "yona:goals": Goal[];
          };
        };
      };
    };
  };
  _links: {
    self: {
      href: string;
    };
    "yona:weeklyActivityReports": {
      href: string;
    };
    "yona:dailyActivityReports": {
      href: string;
    };
  };
}

export interface BuddiesState {
  loaded: boolean;
  buddies: Buddy[];
}
