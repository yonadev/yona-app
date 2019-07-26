export interface ApiState {
  host: string;
  yonaPassword: string;
  serverMessage: string;
  links: {
    [key: string]: {
      href: string;
    };
  } | null;
  embedded: {
    [key: string]: {
      _embedded: {};
      _links: {
        [key: string]: {
          href: string;
        };
      };
    };
  } | null;
}
