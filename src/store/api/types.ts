export interface ApiState {
  host: string;
  locale: string;
  deviceUUID: string;
  yonaPassword: string;
  serverMessage: string;
  online: boolean;
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
