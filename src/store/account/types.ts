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
    vpn: {
      title: string;
      text: string;
      icon: string;
      is_allowed: boolean;
      disabled: boolean;
    };
  };
}
