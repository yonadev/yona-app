import { RootState } from "@/store/types";
import { PluginObject, VueConstructor } from "vue";
import { Store } from "vuex";
import _Router from "vue-router";

class RouteProtect {
  public router: _Router;
  public store: Store<RootState>;

  constructor(Vue: VueConstructor, router: _Router, store: Store<RootState>) {
    this.router = router;
    this.store = store;
  }

  public checkRouter(to: any, from: any, next: any) {
    const registered = this.store.state.login.isRegistered;
    const loggedIn = this.store.state.login.isLoggedIn;
    const locked = this.store.state.login.isLocked;
    const pinIsReset = this.store.state.login.pinIsReset;
    const pinIsSet = this.store.state.login.pinIsSet;

    if (!registered && !to.meta.public) {
      return next({ name: "Tour" });
    } else if (locked && pinIsReset && !to.meta.pinReset) {
      const now = Math.trunc(new Date().getTime() / 1000);

      if (
        this.store.state.login.locked_timer &&
        now > this.store.state.login.locked_timer
      ) {
        return next({ name: "ValidateLocked" });
      }

      return next({ name: "WaitLocked" });
    } else if (locked && !to.meta.locked && !to.meta.pinReset) {
      return next({ name: "Locked" });
    } else if (to.name === "Login" && !registered) {
      return next({ name: "AddDevice" });
    } else if (!loggedIn && registered && !locked) {
      if (!to.meta.login && pinIsSet) {
        return next({ name: "Login" });
      } else if (!to.meta.pinreset && !pinIsSet) {
        return next({ name: "SetPinCode" });
      }
    }
    // is login page en is not loggedin*/
    return next();
  }
}

export interface AuthOptions {
  router?: _Router;
  store?: Store<RootState>;
}

const install = (
  Vue: VueConstructor,
  options: AuthOptions = {} as AuthOptions
): void => {
  if (!options.router) {
    throw new Error("You must supply a router instance in the options.");
  }
  if (!options.store) {
    throw new Error("You must supply a store instance in the options.");
  }

  const rp = new RouteProtect(Vue, options.router, options.store);

  options.router.beforeEach((to, from, next) => rp.checkRouter(to, from, next));

  return;
};

const plugin: PluginObject<AuthOptions> = {
  install
};
export default plugin;
