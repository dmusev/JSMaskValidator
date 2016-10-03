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

	win.validValues = false;

	/**
	 * NB! Be careful here because those regular expressions need to be with special escaping symbol \\  and not \ 
	 *
	 *  This object structure is important because after parsing regex of of object property is being used !
	 *
	 *	Source of the masking library is:
	 *	https://github.com/RobinHerbots/Inputmask
	 *
	 * 	Feel free to implement custom masks based on these requirements
	 *
	 * remember that it is crucial to set an unique data type with a regex or/and mask.
	 **/


	VE.dataTypes = {
		"datetime": {
			"regex": "^(([0-2]?[0-9]|3[0-1])\\/([0]?[1-9]|1[0-2])\\/([1-2]\\d{3})) (20|21|22|23|[0-1]?\\d{1})\:([0-5]?\\d{1})$",
			/**
			 *Default date mask : dd/mm/yyyy hh:mm
			 *
			 * NB!: Remember to change the date regex when you change the date mask !
			 * 
			 * Other available date masks are:
			 *
			 * dd/mm/yyyy hh:mm dd-mm-yyyy hh:mm, dd.mm.yyyy hh:mm,
			 * dd/mm/yyyy, mm/dd/yyyy, dd.mm.yyyy, dd-mm-yyyy, mm.dd.yyyy, mm-dd-yyyy, yyyy.mm.dd, yyyy-mm-dd,
			 * 
			 */
			"mask": "dd/mm/yyyy hh:mm"
		},
		"username": {
			"regex": "^[a-z0-9@_.]{4,20}$"
		},
		"email": {
			"regex": '^(([^<>()\\[\\]\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,30}))$'
		},
		"password": {
			"regex": "^[A-Za-z0-9!@#$%^&()_]{6,20}$"
		},
		"ip": {
			"regex": "^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
			"mask": "ip"
		},
		"mac": {
			"regex": "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$",
			"mask": "mac"
		},
		"phone": {
			"regex": "^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{3,6}$"
		},
		"floatingPoint": {
			/**
			 * This is custom mask
			 * The 9 number stands for Integers, whereas 'a' stands for aplhabetical symbols. '{}' is about allowed number of symbols
			 * In our case we got first from 1 to 3 integer symbols two times and they are devided by '.', the dot sign can be replaced with whatever sign you want eg: '9{1,3}-9{1,3}''
			 *
			 * Another example is with aplhabetical symbols eg: "a{1,3}.a{1,3}" in this case valid case is: 'asd.dsa'
			 * If we put in our mask like so: "9{1,2}" it will require from us to input a two digit number
			 * 
			 */
			"mask": "9{1,4}.9{1,4}"
		}
	}
})(window);