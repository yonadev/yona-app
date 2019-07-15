export interface ActivityCategory {
  name: string,
  apllications: string[],
  description: string,
  _links: {
    self: {
      href: string
    }
  }
}
export interface Goal {
  '@type' : string,
  creationTime: string,
  maxDurationMinutes?: number,
  zones?: string[],
  historyItem: boolean,
  _links : {
    self: {
      href: string
    },
    edit? : {
      href: string
    }
    'yona:activityCategory' : {
      href: string
    }
  }
}

export interface BudgetGoal extends Goal {
  maxDurationMinutes: number;
}

export interface TimeZoneGoal extends Goal {
  zones: string[],
}

export interface ChallengesState {
  loaded: boolean,
  activityCategories : ActivityCategory[],
  goals: Goal[]
}