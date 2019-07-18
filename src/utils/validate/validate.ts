import Vue from 'vue';
import VeeValidate, { Validator } from 'vee-validate';
//@ts-ignore
import nl from "vee-validate/dist/locale/nl";
let locales = require('../../locales/nl');

import {parsePhoneNumberFromString} from "libphonenumber-js/mobile"

const dictionary = {
  // attributes and messages
  messages: {
    mobile: (fieldName: string, params: any[], data?: any) => {
      return locales.numbervalidation;
    },
    required: (fieldName: string, params: any[], data?: any) => {
      let message;

      if(fieldName === 'firstname'){
        message = locales.enterfirstnamevalidation;
      } else if (fieldName === 'lastname'){
        message = locales.enterlastnamevalidation;
      } else if (fieldName === 'nickname'){
        message = locales.enternicknamevalidation;
      }

      return message;
    }
  }
};

Vue.use(VeeValidate)

Validator.localize('nl', nl); // changes the locale
Validator.localize('nl', dictionary); // overwrites some messages

Validator.extend('mobile', {
  validate: function (value) {
    const number = parsePhoneNumberFromString(value)

    return (number !== undefined && number.isValid());
  }
});