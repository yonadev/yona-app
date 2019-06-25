export interface LinksState {
  links: {
    [key: string] : {
      href: string
    }
  } | null;
  embedded: {
    [key: string]: {
      _embedded: {},
      _links: {
        [key: string]: {
          href: string
        }
      }
    }
  } | null;
}