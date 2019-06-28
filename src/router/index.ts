import Vue from 'vue'
import Router from 'vue-router'

import Start from '../views/Start.vue'

//Welcome modole
import AbstractWelcome from '../views/Welcome/AbstractWelcome.vue'
import Tour from '../views/Welcome/Tour.vue'
import Choose from '../views/Welcome/Choose.vue'

//Welcome modole
import AbstractLogin from '../views/Login/AbstractLogin.vue'
import Login from '../views/Login/Login.vue'
import Locked from '../views/Login/Locked.vue'
import WaitLocked from '../views/Login/WaitLocked.vue'
import ValidateLocked from '../views/Login/ValidateLocked.vue'
import AddDevice from '../views/Login/AddDevice.vue'

    //Welcome -> recover submodule
    import AbstractRecoverAccount from '../views/Login/RecoverAccount/AbstractRecoverAccount.vue'
    import PhoneNumber from '../views/Login/RecoverAccount/PhoneNumber.vue'
    import RecoverSms from '../views/Login/RecoverAccount/RecoverSms.vue'

//Signup modole
import AbstractSignUp from '../views/Signup/AbstractSignUp.vue'
import Names from '../views/Signup/Names.vue'
import AccountInfo from '../views/Signup/AccountInfo.vue'
import SmsValidation from '../views/Signup/SmsValidation.vue'

    //Signup -> pincode submodule
    import AbstractSetPinCode from '../views/Signup/Pincode/AbstractSetPinCode.vue'
    import SetPinCode from '../views/Signup/Pincode/SetPinCode.vue'
    import ConfirmPinCode from '../views/Signup/Pincode/ConfirmPinCode.vue'

    //Signup -> permission module
    import AbstractPermissions from '../views/Signup/Permissions/AbstractPermissions.vue'
    import Intro from '../views/Signup/Permissions/Intro.vue'
    import GivePermission from '../views/Signup/Permissions/GivePermission.vue'

//Me module
import AbstractMe from '../views/Me/AbstractMe.vue'
import Me from '../views/Me/Me.vue'
import Profile from '../views/Me/Profile.vue'
import Notifications from '../views/Me/Notifications.vue'
import FriendRequest from '../views/Me/FriendRequest.vue'
import DetailedViewDay from '../views/Me/DetailedViews/DetailedViewDay.vue'

//Friends module
import AbstractFriends from '../views/Friends/AbstractFriends.vue'
import TimeLine from '../views/Friends/TimeLine.vue'
import Overview from '../views/Friends/Overview.vue'
import FriendAdd from '../views/Friends/Add.vue'

    //Submodule Friends -> Friend
    import AbstractFriend from '../views/Friends/Friend/AbstractFriend.vue'
    import Statistics from '../views/Friends/Friend/Statistics.vue'
    import FriendsProfile from '../views/Friends/Friend/Profile.vue'

//Challenges module
import AbstractChallenges from '../views/Challenges/AbstractChallenges.vue'
import ChallengesTabs from '../views/Challenges/ChallengesTabs.vue'

    //Challenge tab components
    import ChallengesOverview from '../views/Challenges/ChallengesOverview.vue'
    import ChallengesContent from '../views/Challenges/ChallengesContent.vue'
    import ChallengesCategoryChoose from '../views/Challenges/ChallengesCategoryChoose.vue'

    //Submodule Challenges -> Setup
    import ChallengesSetupAbstract from '../views/Challenges/Setup/SetupAbstract.vue'
    import ChallengesSetup from '../views/Challenges/Setup/Setup.vue'


//Settings module
import AbstractSettings from '../views/Settings/AbstractSettings.vue'
import Settings from '../views/Settings/Settings.vue'

    import AbstractSettingsOverview from '../views/Settings/SettingsOverview/AbstractSettingsOverview.vue'
        import SettingsAddDevice from '../views/Settings/SettingsOverview/AddDevice.vue'
        import Unsubscribe from '../views/Settings/SettingsOverview/Unsubscribe.vue'

    import ChangePinCode from '../views/Settings/PinCode/ChangePinCode.vue'
    import CheckPinCode from '../views/Settings/PinCode/CheckPinCode.vue'
    import ConfirmNewPinCode from '../views/Settings/PinCode/ConfirmNewPinCode.vue'
    import ChangeLocked from '../views/Settings/PinCode/ChangeLocked.vue'
    import ChangeWaitLocked from '../views/Settings/PinCode/ChangeWaitLocked.vue'

    import Privacy from '../views/Settings/Privacy/Privacy.vue'
    import Help from '../views/Settings/Help/Help.vue'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Start',
            component: Start
        },
        {
            path: '/welcome',
            component: AbstractWelcome,
            meta: {
                public: true
            },
            children: [
                {
                    path: 'tour',
                    name: 'Tour',
                    component: Tour,
                    meta: {
                        public: true
                    }
                },
                {
                    path: 'choose',
                    name: 'Choose',
                    component: Choose,
                    meta: {
                        public: true
                    }
                }
            ]
        },
        {
            path: '/auth',
            component: AbstractLogin,
            children: [
                {
                    path: 'login',
                    name: 'Login',
                    component: Login,
                    meta: {
                        public: true,
                        login: true
                    }
                },
                {
                    path: 'locked',
                    name: 'Locked',
                    component: Locked,
                    meta: {
                        public: true,
                        locked: true,
                    }
                },
                {
                    path: 'wait',
                    name: 'WaitLocked',
                    component: WaitLocked,
                    meta: {
                        public: true,
                        pinReset: true
                    }
                },
                  {
                    path: 'validatelocked',
                    name: 'ValidateLocked',
                    component: ValidateLocked,
                    meta: {
                        public: true,
                        pinReset: true
                    }
                  },
                {
                    path: 'add',
                    name: 'AddDevice',
                    component: AddDevice,
                    meta: {
                        public: true
                    }
                },
                {
                    path: 'recover',
                    component: AbstractRecoverAccount,
                    meta: {
                        public: true
                    },
                    children: [
                        {
                            path: '/',
                            name: 'PhoneNumber',
                            component: PhoneNumber,
                            meta: {
                                public: true
                            }
                        },
                        {
                            path: 'sms',
                            name: 'RecoverSms',
                            component: RecoverSms,
                            meta: {
                                public: true
                            }
                        }
                    ]
                }
            ]
        },
        {
            path: '/signup',
            component: AbstractSignUp,
            meta: {
                public: true
            },
            children: [
                {
                    path: 'names',
                    name: 'Names',
                    component: Names,
                    meta: {
                        public: true
                    }
                },
                {
                    path: 'accountinfo',
                    name: 'AccountInfo',
                    component: AccountInfo,
                    meta: {
                        public: true
                    }
                },
                {
                    path: 'validation',
                    name: 'SmsValidation',
                    component: SmsValidation,
                    meta: {
                        public: true
                    }
                },
                {
                    path: 'pincode',
                    component: AbstractSetPinCode,
                    meta: {
                        public: true
                    },
                    children: [
                        {
                            path: '/',
                            name: 'SetPinCode',
                            component: SetPinCode,
                            meta: {
                                public: true,
                                pinreset: true
                            }
                        },
                        {
                            path: 'confirm',
                            name: 'ConfirmPinCode',
                            component: ConfirmPinCode,
                            meta: {
                                public: true,
                                pinreset: true
                            }
                        }
                    ]
                },
              {
                path: 'permissions',
                component: AbstractPermissions,
                children: [
                  {
                    path: 'intro',
                    name: 'Intro',
                    component: Intro
                  },
                  {
                    path: 'permission',
                    name: "GivePermission",
                    component: GivePermission
                  }
                ]
              }
            ]
        },
        {
            path: '/me',
            component: AbstractMe,
            children: [
                {
                    path: '',
                    name: 'Me',
                    component: Me
                },
                {
                    path: 'profile',
                    name: 'Profile',
                    component: Profile
                },
                {
                    path: 'notifications',
                    name: 'Notifications',
                    component: Notifications
                },
                {
                    path: 'friendrequest',
                    name: 'FriendRequest',
                    component: FriendRequest,
                    props: true
                },
                {
                    path: 'detailed-day',
                    name: 'DetailedViewDay',
                    component: DetailedViewDay
                }
            ]
        },
        {
            path: '/friends',
            component: AbstractFriends,
            children: [
                {
                    path: '',
                    name: 'TimeLine',
                    component: TimeLine
                },
                {
                    path: 'overview',
                    name: 'Overview',
                    component: Overview
                },
                {
                    path: 'add',
                    name: 'FriendAdd',
                    component: FriendAdd
                },
                {
                    path: 'profile',
                    name: 'FriendsProfile',
                    component: FriendsProfile,
                    props: true
                },
                {
                    path: ':id',
                    component: AbstractFriend,
                    children: [
                        {
                            path: 'statistics',
                            name: 'Statistics',
                            component: Statistics
                        }
                    ]
                }
            ]
        },
        {
            path: '/challenges',
            component: AbstractChallenges,
            children: [
                {
                    path: '',
                    component: ChallengesTabs,
                    children: [
                        {
                            path: ':type',
                            name: 'ChallengesContent',
                            component: ChallengesContent,
                            props: true,
                            children: [
                                {
                                    path: 'overview',
                                    name: 'ChallengesOverview',
                                    component: ChallengesOverview,
                                    props: true
                                },
                                {
                                    path: 'chooseCategory',
                                    name: 'ChallengesCategoryChoose',
                                    component: ChallengesCategoryChoose,
                                    props: true
                                }
                            ]
                        }
                    ]
                },
                {
                    path: 'setup',
                    component: ChallengesSetupAbstract,
                    props: true,
                    children: [
                        {
                            path: ':type/:category',
                            name: 'ChallengesSetup',
                            component: ChallengesSetup,
                            props: true
                        }
                    ]
                }
            ]
        },
        {
            path: '/settings',
            component: AbstractSettings,
            children: [
                {
                    path: '',
                    name: 'Settings',
                    component: Settings
                },
                {
                    path: 'overview',
                    component: AbstractSettingsOverview,
                    children: [
                        {
                            path: 'checkpin',
                            name: 'CheckPinCode',
                            component: CheckPinCode
                        },
                        {
                            path: 'changepin',
                            name: 'ChangePinCode',
                            component: ChangePinCode
                        },
                        {
                            path: 'confirmpin',
                            name: 'ConfirmNewPinCode',
                            component: ConfirmNewPinCode
                        },
                        {
                            path: 'changelocked',
                            name: 'ChangeLocked',
                            component: ChangeLocked
                        },
                        {
                            path: 'changewaitlocked',
                            name: 'ChangeWaitLocked',
                            component: ChangeWaitLocked
                        },
                        {
                            path: 'adddevice',
                            name: 'SettingsAddDevice',
                            component: SettingsAddDevice
                        },
                        {
                            path: 'unsubscribe',
                            name: 'Unsubscribe',
                            component: Unsubscribe
                        }
                    ]
                },
                {
                    path: 'privacy',
                    name: 'Privacy',
                    component: Privacy
                },
                {
                    path: 'help',
                    name: 'Help',
                    component: Help
                }
            ]
        },
    ]
})