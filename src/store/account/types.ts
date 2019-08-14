export interface AccountState {
  firstname: string | null;
  lastname: string | null;
  phonenumber: string;
  nickname: string | null;
  permissions: {
    tracking: {
      title: string;
      text: string;
      icon: string;
      is_allowed: boolean;
    };
    autostart: {
      title: string;
      text: string;
      icon: string;
      is_allowed: boolean;
    };
    certificate: {
      title: string;
      text: string;
      icon: string;
      is_allowed: boolean;
    };
    vpn: {
      title: string;
      text: string;
      icon: string;
      is_allowed: boolean;
    };
  };
}
