import Vue from 'vue'
import Router from 'vue-router'

import Start from './views/Start.vue'

//Welcome modole
import AbstractWelcome from './views/Welcome/AbstractWelcome.vue'
import Transparency from './views/Welcome/Transparency.vue'
import Share from './views/Welcome/Share.vue'
import Limits from './views/Welcome/Limits.vue'
import Activities from './views/Welcome/Activities.vue'
import Choose from './views/Welcome/Choose.vue'

//Welcome modole
import AbstractLogin from './views/login/AbstractLogin.vue'
import Pincode from './views/login/Pincode.vue'
import Locked from './views/login/Locked.vue'
import WaitLocked from './views/login/WaitLocked.vue'
import AddDevice from './views/login/AddDevice.vue'

    //Welcome -> recover submodule
    import AbstractRecoverAccount from './views/login/RecoverAccount/AbstractRecoverAccount.vue'
    import PhoneNumber from './views/login/RecoverAccount/PhoneNumber.vue'
    import RecoverSms from './views/login/RecoverAccount/RecoverSms.vue'

//Signup modole
import AbstractSignUp from './views/signup/AbstractSignUp.vue'
import Names from './views/signup/Names.vue'
import AccountInfo from './views/signup/AccountInfo.vue'
import SmsValidation from './views/signup/SmsValidation.vue'

    //Signup -> pincode submodule
    import AbstractSetPinCode from './views/signup/Pincode/AbstractSetPinCode.vue'
    import SetPinCode from './views/signup/Pincode/SetPinCode.vue'
    import ConfirmPinCode from './views/signup/Pincode/ConfirmPinCode.vue'

//Me module
import AbstractMe from './views/Me/AbstractMe.vue'
import Me from './views/Me/Me.vue'
import Profile from './views/Me/Profile.vue'
import Notifications from './views/Me/Notifications.vue'

//Friends module
import AbstractFriends from './views/Friends/AbstractFriends.vue'
import TimeLine from './views/Friends/TimeLine.vue'
import Overview from './views/Friends/Overview.vue'
import FriendAdd from './views/Friends/Add.vue'

    //Submodule Friends -> Friend
    import AbstractFriend from './views/Friends/Friend/AbstractFriend.vue'
    import Statistics from './views/Friends/Friend/Statistics.vue'
    import FriendsProfile from './views/Friends/Friend/Profile.vue'

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
            children: [
                {
                    path: 'transparency',
                    name: 'Transparency',
                    component: Transparency
                },
                {
                    path: 'share',
                    name: 'Share',
                    component: Share
                },
                {
                    path: 'limits',
                    name: 'Limits',
                    component: Limits
                },
                {
                    path: 'activities',
                    name: 'Activities',
                    component: Activities
                },
                {
                    path: 'choose',
                    name: 'Choose',
                    component: Choose
                }
            ]
        },
        {
            path: '/auth',
            component: AbstractLogin,
            children: [
                {
                    path: 'pincode',
                    name: 'Pincode',
                    component: Pincode
                },
                {
                    path: 'locked',
                    name: 'Locked',
                    component: Locked
                },
                {
                    path: 'wait',
                    name: 'WaitLocked',
                    component: WaitLocked
                },
                {
                    path: 'add',
                    name: 'AddDevice',
                    component: AddDevice
                },
                {
                    path: 'recover',
                    component: AbstractRecoverAccount,
                    children: [
                        {
                            path: '/',
                            name: 'PhoneNumber',
                            component: PhoneNumber
                        },
                        {
                            path: 'sms',
                            name: 'RecoverSms',
                            component: RecoverSms
                        }
                    ]
                }
            ]
        },
        {
            path: '/signup',
            component: AbstractSignUp,
            children: [
                {
                    path: 'names',
                    name: 'Names',
                    component: Names
                },
                {
                    path: 'accountinfo',
                    name: 'AccountInfo',
                    component: AccountInfo
                },
                {
                    path: 'validation',
                    name: 'SmsValidation',
                    component: SmsValidation
                },
                {
                    path: 'pincode',
                    component: AbstractSetPinCode,
                    children: [
                        {
                            path: '/',
                            name: 'SetPinCode',
                            component: SetPinCode
                        },
                        {
                            path: 'confirm',
                            name: 'ConfirmPinCode',
                            component: ConfirmPinCode
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
                    path: ':id',
                    component: AbstractFriend,
                    children: [
                        {
                            path: 'statistics',
                            name: 'Statistics',
                            component: Statistics
                        },
                        {
                            path: 'profile',
                            name: 'FriendsProfile',
                            component: FriendsProfile
                        }
                    ]
                }
            ]
        }
    ]
})
