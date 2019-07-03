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
  maxDurationMinutes?: number,
  zones?: string[],
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

export interface ChallengesState {
  loaded: boolean,
  activityCategories : ActivityCategory[],
  goals: Goal[]
}