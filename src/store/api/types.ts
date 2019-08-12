export interface Device {
  name: string;
  firebaseInstanceId: string;
  isVpnConnected: boolean;
  operatingSystem: string;
  requestingDevice: boolean;
  vpnProfile: {
    vpnLoginID: string;
    vpnPassword: string;
    _links: {
      "yona:ovpnProfile": {
        href: string;
      };
    };
  };
  _links: {
    self: {
      href: string;
    };
    edit: {
      href: string;
    };
    "yona:postOpenAppEvent": {
      href: string;
    };
    "yona:appActivity": {
      href: string;
    };
    "yona:sslRootCert": {
      href: string;
    };
  };
}

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
      _embedded: {
        "yona:devices": Device[];
      };
      _links: {
        [key: string]: {
          href: string;
        };
      };
    };
  } | null;
}
