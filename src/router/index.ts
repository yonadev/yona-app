import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/welcome/tour",
      name: "Start",
      component: () => import("../views/Start.vue")
    },
    {
      path: "/welcome",
      component: () => import("../views/Welcome/AbstractWelcome.vue"),
      meta: {
        public: true
      },
      children: [
        {
          path: "tour",
          name: "Tour",
          component: () => import("../views/Welcome/Tour.vue"),
          meta: {
            public: true
          }
        },
        {
          path: "choose",
          name: "Choose",
          component: () => import("../views/Welcome/Choose.vue"),
          meta: {
            public: true,
            prev: "Tour"
          }
        }
      ]
    },
    {
      path: "/auth",
      component: () => import("../views/Login/AbstractLogin.vue"),
      children: [
        {
          path: "login",
          name: "Login",
          component: () => import("../views/Login/Login.vue"),
          meta: {
            public: true,
            login: true
          }
        },
        {
          path: "locked",
          name: "Locked",
          component: () => import("../views/Login/Locked.vue"),
          meta: {
            public: true,
            locked: true
          }
        },
        {
          path: "wait",
          name: "WaitLocked",
          component: () => import("../views/Login/WaitLocked.vue"),
          meta: {
            public: true,
            pinReset: true
          }
        },
        {
          path: "validatelocked",
          name: "ValidateLocked",
          component: () => import("../views/Login/ValidateLocked.vue"),
          meta: {
            public: true,
            pinReset: true
          }
        },
        {
          path: "add",
          name: "AddDevice",
          component: () => import("../views/Login/AddDevice.vue"),
          meta: {
            public: true,
            prev: "Choose"
          }
        },
        {
          path: "recover",
          component: () =>
            import("../views/Login/RecoverAccount/AbstractRecoverAccount.vue"),
          meta: {
            public: true
          },
          children: [
            {
              path: "/",
              name: "PhoneNumber",
              component: () =>
                import("../views/Login/RecoverAccount/PhoneNumber.vue"),
              meta: {
                public: true,
                prev: "AccountInfo"
              }
            },
            {
              path: "sms",
              name: "RecoverSms",
              component: () =>
                import("../views/Login/RecoverAccount/RecoverSms.vue"),
              meta: {
                public: true,
                prev: "PhoneNumber"
              }
            }
          ]
        }
      ]
    },
    {
      path: "/signup",
      component: () => import("../views/Signup/AbstractSignUp.vue"),
      meta: {
        public: true
      },
      children: [
        {
          path: "names",
          name: "Names",
          component: () => import("../views/Signup/Names.vue"),
          meta: {
            public: true,
            prev: "Choose"
          }
        },
        {
          path: "accountinfo",
          name: "AccountInfo",
          component: () => import("../views/Signup/AccountInfo.vue"),
          meta: {
            public: true,
            prev: "Names"
          }
        },
        {
          path: "validation",
          name: "SmsValidation",
          component: () => import("../views/Signup/SmsValidation.vue"),
          meta: {
            public: true,
            prev: "Names"
          }
        },
        {
          path: "pincode",
          component: () =>
            import("../views/Signup/Pincode/AbstractSetPinCode.vue"),
          meta: {
            public: true
          },
          children: [
            {
              path: "/",
              name: "SetPinCode",
              component: () => import("../views/Signup/Pincode/SetPinCode.vue"),
              meta: {
                public: true,
                pinreset: true,
                prev: "actual"
              }
            },
            {
              path: "confirm",
              name: "ConfirmPinCode",
              component: () =>
                import("../views/Signup/Pincode/ConfirmPinCode.vue"),
              meta: {
                public: true,
                pinreset: true,
                prev: "SetPinCode"
              }
            }
          ]
        },
        {
          path: "permissions",
          component: () =>
            import("../views/Signup/Permissions/AbstractPermissions.vue"),
          children: [
            {
              path: "intro",
              name: "Intro",
              component: () => import("../views/Signup/Permissions/Intro.vue"),
              meta: {
                permission: true
              }
            },
            {
              path: "permission",
              name: "GivePermission",
              component: () =>
                import("../views/Signup/Permissions/GivePermission.vue"),
              meta: {
                permission: true
              }
            }
          ]
        }
      ]
    },
    {
      path: "/me",
      component: () => import("../views/Me/AbstractMe.vue"),
      children: [
        {
          path: "",
          name: "MeTabs",
          component: () => import("../views/Me/MeTabs.vue"),
          children: [
            {
              path: "day",
              name: "MeTimeLineDay",
              component: () => import("../views/Me/Tabs/Day.vue"),
              meta: {
                parent: "MeTabs",
                position: 1
              }
            },
            {
              path: "week",
              name: "MeTimeLineWeek",
              component: () => import("../views/Me/Tabs/Week.vue"),
              meta: {
                parent: "MeTabs",
                position: 2,
                prev: "MeTimeLineDay"
              }
            }
          ]
        },
        {
          path: "profile",
          name: "Profile",
          component: () => import("../views/Me/Profile.vue"),
          meta: {
            prev: "MeTimeLineDay"
          }
        },
        {
          path: "notifications",
          name: "Notifications",
          component: () => import("../views/Me/Notifications.vue"),
          meta: {
            prev: "MeTimeLineDay"
          }
        },
        {
          path: "read-notification",
          name: "ReadNotification",
          component: () => import("../views/Me/ReadNotification.vue"),
          props: true,
          meta: {
            prev: "Notifications"
          }
        },
        {
          path: "friendrequest",
          name: "FriendRequest",
          component: () => import("../views/Me/FriendRequest.vue"),
          props: true,
          meta: {
            prev: "Notifications"
          }
        },
        {
          path: "detailed-day/:activity_link",
          name: "DetailedViewDay",
          component: () => import("../views/Timeline/DetailedViewDay.vue"),
          props: true,
          meta: {
            prev: "MeTimeLineDay"
          }
        },
        {
          path: "detailed-week/:activity_link",
          name: "DetailedViewWeek",
          component: () => import("../views/Timeline/DetailedViewWeek.vue"),
          props: true,
          meta: {
            prev: "MeTimeLineWeek"
          }
        }
      ]
    },
    {
      path: "/friends",
      component: () => import("../views/Friends/AbstractFriends.vue"),
      children: [
        {
          path: "",
          name: "FriendsTabs",
          component: () => import("../views/Friends/FriendsTabs.vue"),
          children: [
            {
              path: "timeline",
              name: "FriendsTimeLine",
              component: () => import("../views/Friends/FriendsTimeLine.vue"),
              meta: {
                prev: "MeTimeLineDay"
              }
            },
            {
              path: "overview",
              name: "FriendsOverview",
              component: () => import("../views/Friends/FriendsOverview.vue"),
              meta: {
                prev: "FriendsTimeLine"
              }
            }
          ]
        },
        {
          path: "",
          name: "FriendsAddTabs",
          component: () =>
            import("../views/Friends/FriendsAdd/FriendsAddTabs.vue"),
          children: [
            {
              path: "add",
              name: "FriendsAddManual",
              component: () =>
                import("../views/Friends/FriendsAdd/FriendsAddManual.vue"),
              meta: {
                prev: "FriendsOverview"
              }
            },
            {
              path: "addressbook",
              name: "FriendsAddAddressBook",
              component: () =>
                import("../views/Friends/FriendsAdd/FriendsAddAddressBook.vue"),
              meta: {
                prev: "FriendsOverview"
              }
            }
          ]
        },
        {
          path: ":buddy_href",
          component: () => import("../views/Friends/Friend/AbstractFriend.vue"),
          children: [
            {
              path: "profile",
              name: "FriendsProfile",
              component: () => import("../views/Friends/Friend/Profile.vue"),
              props: true,
              meta: {
                prev: "FriendsOverview"
              }
            },
            {
              path: "detailed-day/:activity_link",
              name: "FriendsDetailedViewDay",
              component: () => import("../views/Timeline/DetailedViewDay.vue"),
              props: true,
              meta: {
                prev: "FriendTimeLineDay"
              }
            },
            {
              path: "detailed-week/:activity_link",
              name: "FriendsDetailedViewWeek",
              component: () => import("../views/Timeline/DetailedViewWeek.vue"),
              props: true,
              meta: {
                prev: "FriendTimeLineWeek"
              }
            },
            {
              path: "timeline",
              name: "FriendsTimeLineTabs",
              component: () =>
                import("../views/Friends/Friend/TimeLine/TimeLineTabs.vue"),
              props: true,
              children: [
                {
                  path: "day",
                  name: "FriendTimeLineDay",
                  component: () =>
                    import("../views/Friends/Friend/TimeLine/Tabs/Day.vue"),
                  props: true,
                  meta: {
                    prev: "FriendsProfile"
                  }
                },
                {
                  path: "week",
                  name: "FriendTimeLineWeek",
                  component: () =>
                    import("../views/Friends/Friend/TimeLine/Tabs/Week.vue"),
                  props: true,
                  meta: {
                    prev: "FriendTimeLineDay"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: "/challenges",
      component: () => import("../views/Challenges/AbstractChallenges.vue"),
      children: [
        {
          path: "",
          component: () => import("../views/Challenges/ChallengesTabs.vue"),
          children: [
            {
              path: ":type/overview",
              name: "ChallengesOverview",
              component: () =>
                import("../views/Challenges/ChallengesOverview.vue"),
              props: true,
              meta: {
                prev: "MeTimeLineDay"
              }
            },
            {
              path: ":type/chooseCategory",
              name: "ChallengesCategoryChoose",
              component: () =>
                import("../views/Challenges/ChallengesCategoryChoose.vue"),
              props: true,
              meta: {
                prev: "ChallengesOverview"
              }
            }
          ]
        },
        {
          path: "setup",
          component: () =>
            import("../views/Challenges/Setup/SetupAbstract.vue"),
          props: true,
          children: [
            {
              path: ":type/:category/:goal_url?",
              name: "ChallengesSetup",
              component: () => import("../views/Challenges/Setup/Setup.vue"),
              props: true,
              meta: {
                prev: "ChallengesOverview"
              }
            }
          ]
        }
      ]
    },
    {
      path: "/settings",
      component: () => import("../views/Settings/AbstractSettings.vue"),
      children: [
        {
          path: "overview",
          component: () =>
            import("../views/Settings/SettingsOverview/AbstractSettingsOverview.vue"),
          children: [
            {
              path: "",
              name: "Settings",
              component: () =>
                import("../views/Settings/SettingsOverview/Settings.vue"),
              meta: {
                prev: "MeTimeLineDay"
              }
            },
            {
              path: "privacy",
              name: "Privacy",
              component: () =>
                import("../views/Settings/SettingsOverview/Privacy.vue"),
              meta: {
                prev: "Settings"
              }
            },
            {
              path: "unsubscribe",
              name: "Unsubscribe",
              component: () =>
                import("../views/Settings/SettingsOverview/Unsubscribe.vue"),
              meta: {
                prev: "Settings"
              }
            },
            {
              path: "devices-overview",
              component: () =>
                import("../views/Settings/SettingsOverview/Devices/AbstractDevices.vue"),
              children: [
                {
                  path: "devices",
                  name: "Devices",
                  component: () =>
                    import("../views/Settings/SettingsOverview/Devices/Devices.vue"),
                  meta: {
                    prev: "Settings"
                  }
                },
                {
                  path: "adddevice",
                  name: "SettingsAddDevice",
                  component: () =>
                    import("../views/Settings/SettingsOverview/Devices/AddDevice.vue"),
                  meta: {
                    prev: "Devices"
                  }
                },
                {
                  path: "viewdevice",
                  name: "ViewDevice",
                  component: () =>
                    import("../views/Settings/SettingsOverview/Devices/ViewDevice.vue"),
                  props: true,
                  meta: {
                    prev: "Devices"
                  }
                }
              ]
            }
          ]
        },
        {
          path: "checkpin",
          name: "CheckPinCode",
          component: () => import("../views/Settings/PinCode/CheckPinCode.vue"),
          meta: {
            prev: "Settings"
          }
        },
        {
          path: "changepin/:wrong_pincode",
          name: "ChangePinCode",
          component: () =>
            import("../views/Settings/PinCode/ChangePinCode.vue"),
          props: true,
          meta: {
            prev: "Settings"
          }
        },
        {
          path: "confirmpin/:pincode",
          name: "ConfirmNewPinCode",
          component: () =>
            import("../views/Settings/PinCode/ConfirmNewPinCode.vue"),
          props: true,
          meta: {
            prev: "ChangePinCode"
          }
        },
        {
          path: "changelocked",
          name: "ChangeLocked",
          component: () => import("../views/Settings/PinCode/ChangeLocked.vue")
        },
        {
          path: "changewaitlocked",
          name: "ChangeWaitLocked",
          component: () =>
            import("../views/Settings/PinCode/ChangeWaitLocked.vue")
        }
      ]
    }
  ]
});
