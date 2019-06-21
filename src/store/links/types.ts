export interface LinksState {
  links: {
    [key: string] : {
      href: string
    }
  } | null;
  embedded: {} | null;
}