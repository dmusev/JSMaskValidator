"use strict";

(function(win) {
	/**
	 * Constructor
	 * =============================================================
	 */
	var VE = win.VE = win.VE || {
		version: "2.0",
		global: win
	}; //

	win.validForm = false;
	win.json = JSON.stringify({
	  "masking": [
	    {
	      "type": "DATETIME_DDMMYYYY_HHMM",
	      "regex": "^(([0-2]?[0-9]|3[0-1])\\/([0]?[1-9]|1[0-2])\\/([1-2]\\d{3})) (20|21|22|23|[0-1]?\\d{1})\\:([0-5]?\\d{1})$",
	      "mask": "dd/mm/yyyy hh:mm",
	      "exclude": "",
	      "length": ""
	    },
	    {
	      "type": "USERNAME_MIN4_MAX20",
	      "regex": "^[a-z0-9@_.]",
	      "mask": "",
	      "exclude": "",
	      "length": "4,20"
	    },
	    {
	      "type": "EMAIL",
	      "regex": "^(([^<>()\\[\\]\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,30}))$",
	      "mask": "",
	      "exclude": "",
	      "length": ""
	    },
	    {
	      "type": "PASSWORD",
	      "regex": "^[A-Za-z0-9!@#$%^&()_]",
	      "mask": "",
	      "exclude": "",
	      "length": "6,20"
	    },
	    {
	      "type": "IP",
	      "regex": "^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
	      "mask": "ip",
	      "exclude": "",
	      "length": ""
	    },
	    {
	      "type": "MAC",
	      "regex": "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$",
	      "mask": "mac",
	      "exclude": "",
	      "length": ""
	    },
	    {
	      "type": "PHONE",
	      "regex": "^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]",
	      "mask": "",
	      "exclude": "",
	      "length": "3,6"
	    },
	    {
	      "type": "DECIMAL",
	      "regex": "",
	      "mask": "",
	      "exclude": "",
	      "custom": {
	        "type": "9,9",
	        "delimiter": ".",
	        "minLength": "1,2",
	        "maxLength": "3,2"
	      }
	    },
	    {
	      "type": "INTEGER",
	      "regex": "^[0-9]",
	      "mask": "",
	      "exclude": "",
	      "custom": {
	        "type": "9",
	        "delimiter": "",
	        "minLength": "6",
	        "maxLength": "6"
	      }
	    }
	  ],
	  "ids": {
	    "username": "USERNAME_MIN4_MAX20",
	    "password": "PASSWORD",
	    "email": "EMAIL",
	    "phone": "PHONE",
	    "date": "DATETIME_DDMMYYYY_HHMM",
	    "ip": "IP",
	    "mac": "MAC",
	    "decimal": "DECIMAL",
	    "integer": "INTEGER"
	  },
	  "buttons" : {
	  	"submit" : "submitButtonId"
	  }
	});

})(window);