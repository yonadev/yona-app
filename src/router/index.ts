import Vue from 'vue';
import Router from 'vue-router';

import Start from '../views/Start.vue';

// Welcome modole
import AbstractWelcome from '../views/Welcome/AbstractWelcome.vue';
import Tour from '../views/Welcome/Tour.vue';
import Choose from '../views/Welcome/Choose.vue';

// Welcome modole
import AbstractLogin from '../views/Login/AbstractLogin.vue';
import Login from '../views/Login/Login.vue';
import Locked from '../views/Login/Locked.vue';
import WaitLocked from '../views/Login/WaitLocked.vue';
import ValidateLocked from '../views/Login/ValidateLocked.vue';
import AddDevice from '../views/Login/AddDevice.vue';

    // Welcome -> recover submodule
import AbstractRecoverAccount from '../views/Login/RecoverAccount/AbstractRecoverAccount.vue';
import PhoneNumber from '../views/Login/RecoverAccount/PhoneNumber.vue';
import RecoverSms from '../views/Login/RecoverAccount/RecoverSms.vue';

// Signup modole
import AbstractSignUp from '../views/Signup/AbstractSignUp.vue';
import Names from '../views/Signup/Names.vue';
import AccountInfo from '../views/Signup/AccountInfo.vue';
import SmsValidation from '../views/Signup/SmsValidation.vue';

    // Signup -> pincode submodule
import AbstractSetPinCode from '../views/Signup/Pincode/AbstractSetPinCode.vue';
import SetPinCode from '../views/Signup/Pincode/SetPinCode.vue';
import ConfirmPinCode from '../views/Signup/Pincode/ConfirmPinCode.vue';

    // Signup -> permission module
import AbstractPermissions from '../views/Signup/Permissions/AbstractPermissions.vue';
import Intro from '../views/Signup/Permissions/Intro.vue';
import GivePermission from '../views/Signup/Permissions/GivePermission.vue';

// Challenges module
import AbstractChallenges from '../views/Challenges/AbstractChallenges.vue';
import ChallengesTabs from '../views/Challenges/ChallengesTabs.vue';

    // Challenge tab components
import ChallengesOverview from '../views/Challenges/ChallengesOverview.vue';
import ChallengesContent from '../views/Challenges/ChallengesContent.vue';
import ChallengesCategoryChoose from '../views/Challenges/ChallengesCategoryChoose.vue';

    // Submodule Challenges -> Setup
import ChallengesSetupAbstract from '../views/Challenges/Setup/SetupAbstract.vue';
import ChallengesSetup from '../views/Challenges/Setup/Setup.vue';


// Settings module
import AbstractSettings from '../views/Settings/AbstractSettings.vue';

import AbstractSettingsOverview from '../views/Settings/SettingsOverview/AbstractSettingsOverview.vue';
import Settings from '../views/Settings/SettingsOverview/Settings.vue';
import SettingsAddDevice from '../views/Settings/SettingsOverview/AddDevice.vue';
import Unsubscribe from '../views/Settings/SettingsOverview/Unsubscribe.vue';
import Privacy from '../views/Settings/SettingsOverview/Privacy.vue';

import ChangePinCode from '../views/Settings/PinCode/ChangePinCode.vue';
import CheckPinCode from '../views/Settings/PinCode/CheckPinCode.vue';
import ConfirmNewPinCode from '../views/Settings/PinCode/ConfirmNewPinCode.vue';
import ChangeLocked from '../views/Settings/PinCode/ChangeLocked.vue';
import ChangeWaitLocked from '../views/Settings/PinCode/ChangeWaitLocked.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/welcome/tour',
            name: 'Start',
            component: Start,
        },
        {
            path: '/welcome',
            component: AbstractWelcome,
            meta: {
                public: true,
            },
            children: [
                {
                    path: 'tour',
                    name: 'Tour',
                    component: Tour,
                    meta: {
                        public: true,
                    },
                },
                {
                    path: 'choose',
                    name: 'Choose',
                    component: Choose,
                    meta: {
                        public: true,
                    },
                },
            ],
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
                        login: true,
                    },
                },
                {
                    path: 'locked',
                    name: 'Locked',
                    component: Locked,
                    meta: {
                        public: true,
                        locked: true,
                    },
                },
                {
                    path: 'wait',
                    name: 'WaitLocked',
                    component: WaitLocked,
                    meta: {
                        public: true,
                        pinReset: true,
                    },
                },
                  {
                    path: 'validatelocked',
                    name: 'ValidateLocked',
                    component: ValidateLocked,
                    meta: {
                        public: true,
                        pinReset: true,
                    },
                  },
                {
                    path: 'add',
                    name: 'AddDevice',
                    component: AddDevice,
                    meta: {
                        public: true,
                    },
                },
                {
                    path: 'recover',
                    component: AbstractRecoverAccount,
                    meta: {
                        public: true,
                    },
                    children: [
                        {
                            path: '/',
                            name: 'PhoneNumber',
                            component: PhoneNumber,
                            meta: {
                                public: true,
                            },
                        },
                        {
                            path: 'sms',
                            name: 'RecoverSms',
                            component: RecoverSms,
                            meta: {
                                public: true,
                            },
                        },
                    ],
                },
            ],
        },
        {
            path: '/signup',
            component: AbstractSignUp,
            meta: {
                public: true,
            },
            children: [
                {
                    path: 'names',
                    name: 'Names',
                    component: Names,
                    meta: {
                        public: true,
                    },
                },
                {
                    path: 'accountinfo',
                    name: 'AccountInfo',
                    component: AccountInfo,
                    meta: {
                        public: true,
                    },
                },
                {
                    path: 'validation',
                    name: 'SmsValidation',
                    component: SmsValidation,
                    meta: {
                        public: true,
                    },
                },
                {
                    path: 'pincode',
                    component: AbstractSetPinCode,
                    meta: {
                        public: true,
                    },
                    children: [
                        {
                            path: '/',
                            name: 'SetPinCode',
                            component: SetPinCode,
                            meta: {
                                public: true,
                                pinreset: true,
                            },
                        },
                        {
                            path: 'confirm',
                            name: 'ConfirmPinCode',
                            component: ConfirmPinCode,
                            meta: {
                                public: true,
                                pinreset: true,
                            },
                        },
                    ],
                },
              {
                path: 'permissions',
                component: AbstractPermissions,
                children: [
                  {
                    path: 'intro',
                    name: 'Intro',
                    component: Intro,
                  },
                  {
                    path: 'permission',
                    name: 'GivePermission',
                    component: GivePermission,
                  },
                ],
              },
            ],
        },
        {
            path: '/me',
            component: () => import('../views/Me/AbstractMe.vue'),
            children: [
                {
                    path: '',
                    name: 'MeTabs',
                    component: () => import('../views/Me/MeTabs.vue'),
                    children: [
                        {
                            path: 'day',
                            name: 'MeTimeLineDay',
                            component: () => import('../views/Me/Tabs/Day.vue'),
                        },
                        {
                            path: 'week',
                            name: 'MeTimeLineWeek',
                            component: () => import('../views/Me/Tabs/Week.vue'),
                        },
                    ],
                },
                {
                    path: 'profile',
                    name: 'Profile',
                    component: () => import('../views/Me/Profile.vue'),
                },
                {
                    path: 'notifications',
                    name: 'Notifications',
                    component: () => import('../views/Me/Notifications.vue'),
                },
                {
                    path: 'friendrequest',
                    name: 'FriendRequest',
                    component: () => import('../views/Me/FriendRequest.vue'),
                    props: true,
                },
                {
                    path: 'detailed-day/:activity_link',
                    name: 'DetailedViewDay',
                    component: () => import('../views/Timeline/DetailedViewDay.vue'),
                    props: true,
                },
                {
                    path: 'detailed-week/:activity_link',
                    name: 'DetailedViewWeek',
                    component: () => import('../views/Timeline/DetailedViewWeek.vue'),
                    props: true,
                },
            ],
        },
        {
            path: '/friends',
            component: () => import('../views/Friends/AbstractFriends.vue'),
            children: [
                {
                    path: '',
                    name: 'FriendsTabs',
                    component: () => import('../views/Friends/FriendsTabs.vue'),
                    children: [
                        {
                            path: 'timeline',
                            name: 'FriendsTimeLine',
                            component: () => import('../views/Friends/FriendsTimeLine.vue'),
                        },
                        {
                            path: 'overview',
                            name: 'FriendsOverview',
                            component: () => import('../views/Friends/FriendsOverview.vue'),
                        },
                    ],
                },
                {
                    path: 'add',
                    name: 'FriendAdd',
                    component: () => import('../views/Friends/Add.vue'),
                },
                {
                    path: ':buddy_href',
                    component: () => import('../views/Friends/Friend/AbstractFriend.vue'),
                    children: [
                        {
                            path: 'profile',
                            name: 'FriendsProfile',
                            component: () => import('../views/Friends/Friend/Profile.vue'),
                            props: true,
                        },
                        {
                            path: 'detailed-day/:activity_link',
                            name: 'FriendsDetailedViewDay',
                            component: () => import('../views/Timeline/DetailedViewDay.vue'),
                            props: true,
                        },
                        {
                            path: 'detailed-week/:activity_link',
                            name: 'FriendsDetailedViewWeek',
                            component: () => import('../views/Timeline/DetailedViewWeek.vue'),
                            props: true,
                        },
                        {
                            path: 'timeline',
                            name: 'FriendsTimeLineTabs',
                            component: () => import('../views/Friends/Friend/TimeLine/TimeLineTabs.vue'),
                            props: true,
                            children: [
                                {
                                    path: 'day',
                                    name: 'FriendTimeLineDay',
                                    component: () => import('../views/Friends/Friend/TimeLine/Tabs/Day.vue'),
                                    props: true,
                                },
                                {
                                    path: 'week',
                                    name: 'FriendTimeLineWeek',
                                    component: () => import('../views/Friends/Friend/TimeLine/Tabs/Week.vue'),
                                    props: true,
                                },
                            ],
                        },
                    ],
                },
            ],
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
                            path: ':type/overview',
                            name: 'ChallengesOverview',
                            component: ChallengesOverview,
                            props: true,
                        },
                        {
                            path: ':type/chooseCategory',
                            name: 'ChallengesCategoryChoose',
                            component: ChallengesCategoryChoose,
                            props: true,
                        },
                    ],
                },
                {
                    path: 'setup',
                    component: ChallengesSetupAbstract,
                    props: true,
                    children: [
                        {
                            path: ':type/:category/:goal_url?',
                            name: 'ChallengesSetup',
                            component: ChallengesSetup,
                            props: true,
                        },
                    ],
                },
            ],
        },
        {
            path: '/settings',
            component: AbstractSettings,
            children: [
                {
                    path: 'overview',
                    component: AbstractSettingsOverview,
                    children: [
                        {
                            path: '',
                            name: 'Settings',
                            component: Settings,
                        },
                        {
                            path: 'privacy',
                            name: 'Privacy',
                            component: Privacy,
                        },
                        {
                            path: 'adddevice',
                            name: 'SettingsAddDevice',
                            component: SettingsAddDevice,
                        },
                        {
                            path: 'unsubscribe',
                            name: 'Unsubscribe',
                            component: Unsubscribe,
                        },
                    ],
                },
                {
                    path: 'checkpin',
                    name: 'CheckPinCode',
                    component: CheckPinCode,
                },
                {
                    path: 'changepin/:wrong_pincode',
                    name: 'ChangePinCode',
                    component: ChangePinCode,
                    props: true,
                },
                {
                    path: 'confirmpin/:pincode',
                    name: 'ConfirmNewPinCode',
                    component: ConfirmNewPinCode,
                    props: true,
                },
                {
                    path: 'changelocked',
                    name: 'ChangeLocked',
                    component: ChangeLocked,
                },
                {
                    path: 'changewaitlocked',
                    name: 'ChangeWaitLocked',
                    component: ChangeWaitLocked,
                },
            ],
        },
    ],
});
