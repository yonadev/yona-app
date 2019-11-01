export interface AccountState {
  firstname: string | null;
  lastname: string | null;
  phonenumber: string;
  nickname: string | null;
  currentDevice: {
    firebaseInstanceId: string | null;
    sslRootCertCN: boolean;
    name: string;
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
      "yona:postOpenAppEvent": {
        href: string;
      };
      "yona:appActivity": {
        href: string;
      };
      "yona:sslRootCert": {
        href: string;
      };
      edit: {
        href: string;
      };
    };
  } | null;
  permissions: {
    tracking: {
      title: string;
      text: string;
      icon: string;
      is_allowed: boolean;
      disabled: boolean;
    };
    autostart: {
      title: string;
      text: string;
      icon: string;
      is_allowed: boolean;
      disabled: boolean;
    };
    certificate: {
      title: string;
      text: string;
      icon: string;
      is_allowed: boolean;
      disabled: boolean;
    };
    store_files: {
      title: string;
      text: string;
      icon: string;
      is_allowed: boolean;
      disabled: boolean;
    };
    vpn: {
      title: string;
      text: string;
      icon: string;
      is_allowed: boolean;
      disabled: boolean;
    };
  };
}
