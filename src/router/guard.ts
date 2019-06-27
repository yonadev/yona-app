import { RootState } from '../store/types';
import {PluginObject, VueConstructor} from 'vue';
import {Store} from 'vuex'
import _Router from 'vue-router'


class RouteProtect {
  router: _Router;
  store: Store<RootState>;

  constructor(Vue: VueConstructor, router: _Router, store: Store<RootState>) {
    this.router = router;
    this.store = store;
  }

  checkRouter(to: any, from: any, next: any){
    const registered = this.store.state.login.isRegistered;
    const loggedIn = this.store.state.login.isLoggedIn;
    const locked = this.store.state.login.isLocked;

    if (!registered && !to.meta.public) {
      return next({name: "Tour"})
    } else if(locked && !to.meta.locked) {
      return next({name: "Locked"})
    } else if(!loggedIn && registered && !locked) {
      //return next({name: "Login"})
    }

    // is login page en is not loggedin*/
    return next();
  }
}

export interface AuthOptions {
  router?: _Router;
  store?: Store<RootState>;
}

const install = (Vue: VueConstructor, options: AuthOptions = {} as AuthOptions): void => {
  if (!options.router) {
      throw new Error("You must supply a router instance in the options.");
    }
    if (!options.store) {
      throw new Error("You must supply a store instance in the options.");
    }

    const rp = new RouteProtect(Vue, options.router, options.store);

    options.router.beforeEach((to, from, next) => rp.checkRouter(to, from, next));

    return;
}

const plugin: PluginObject<AuthOptions> = {
  install
};
export default plugin;
