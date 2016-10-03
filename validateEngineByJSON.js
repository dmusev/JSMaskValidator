"use strict";

window.onload = function() {

	var ve = new ValidateEngine();

	ve.initialize();
};

var ValidateEngine = function() {

	this.eventOnBlur 		= "blur";
	this.eventOnFocus 		= "focus";
	this.jsonData 			= JSON.parse(testJSON);
	this.ids 				= this.jsonData.ids;
	this.submitButtonID 	= this.jsonData.buttons.submit;
	this.checkForErrorClass = 'errorIcon';
};

ValidateEngine.prototype.initialize = function() {
	var
		_this			= this,
		givenDataTypes	= {}
	;

	_this.validateFields();

	_this.jsonData.masking.forEach(function(dataType) {
		givenDataTypes[dataType["type"]] = {}
		for (var property in dataType) {
			if (dataType.hasOwnProperty(property)) {
				Object.defineProperty(givenDataTypes[dataType["type"]], property, {
					value: dataType[property] ? dataType[property] : ''
				});
			}
		}
	})

	for (var id in _this.ids) {
		if (_this.ids.hasOwnProperty(id)) {
			var dateTypeProperties = givenDataTypes[_this.ids[id]];
			var element = document.getElementById(id) || document.getElementsByName(id)[0];
			if (typeof(element) != 'undefined' && typeof(dateTypeProperties) != 'undefined') {
				this.addListenerByElement(element, dateTypeProperties);
			} else {
				console.warn('Element with id: ' + id + " cannot be properly masked/validated !");
			}
		}
	}
};

ValidateEngine.prototype.addListenerByElement = function(element, dateTypeObj) {

	var
		_this = this
	;

	if (typeof(dateTypeObj.mask) != 'undefined' && dateTypeObj.mask !== '') {
		Inputmask(dateTypeObj.mask).mask(element);
	} else if (typeof(dateTypeObj.custom) != 'undefined' && dateTypeObj.custom !== '') {
		setCustomMask(dateTypeObj.custom, element, _this);
	}

	attachListener(element, function() {
		_this.validateElement(element, dateTypeObj);
	});

	function attachListener(element, functionHandler) {
		element.addEventListener(_this.eventOnBlur, functionHandler);

		element.className += ' clearable';

		$(element).on('input', function() {
			$(element)[tog(element.value)]('x');
		}).
		on('keypress', function() {
			$(element)[tog(element.value)]('x');
			$(element).removeClass('errorIcon');
			$(element).addClass('clearable');
		});
		$(document).
		on('mousemove', '.x', function(e) {
			$(element)[tog(element.offsetWidth - 18 < e.clientX - element.getBoundingClientRect().left)]('onX');
		}).
		on('touchstart click', '.onX', function(e) {
			e.preventDefault();
			$(e.target).removeClass('x onX').val('').change();
		});

		function tog(v) {
			return v ? 'addClass' : 'removeClass';
		}
	}

	function setCustomMask(custom, element, _this) {

		var
			customTypeObj	= custom.type,
			customTypes		= custom.type.split(','),
			customMask 		= '',
			typeDelimiter 	= custom.delimiter ? custom.delimiter.split('') : '',
			customMinLength = custom.minLength ? custom.minLength.split(',') : '1',
			customMaxLength = custom.maxLength ? custom.maxLength.split(',') : '9'
		;

		for (var i = 0; i < customTypes.length; i++) {
			customMask += customTypes[i] + '{' + (customMinLength[i] ? customMinLength[i] : '1') + ',' + (customMaxLength[i] ? customMaxLength[i] : '9') + '}' + (typeDelimiter[i] ? typeDelimiter[i] : '');
		}

		Inputmask(customMask, {
			oncomplete: function(buffer, opts) {
				_this.removeErrorSign(element);
			},
			onincomplete: function(buffer, opts) {
				if(customTypeObj.indexOf('a') >= 0) {
					_this.addErrorSign(element);
				} else {
					_this.applyDecimalBehaviour(element, typeDelimiter);
				}
			},
			clearMaskOnLostFocus: true
		}).
		mask(element);
	};

};

ValidateEngine.prototype.validateElement = function(element, dateTypeObj) {
	var
		_this = this
	;

	_this.validateFields();

	if (checkRegex(element, dateTypeObj.regex) || checkForExclusiveSymbols(element.value, dateTypeObj.exclude)) {
		_this.addErrorSign(element);
	} else {
		_this.removeErrorSign(element);
	}

	function checkRegex(elem, regex) {
		if (typeof(regex) != 'undefined' && regex !== '') {
			var re = new RegExp(regex, 'g');

			if (re.test(elem.value)) {
				return false;
			} else if (elem.value !== "") {
				return true;
			} else if (typeof(elem.value) == "undefined") {
				console.warn('Unable to validate ' + elem.name + ' element.');
				return false;
			}
		} else {
			console.warn('Invalid regex of ' + elem.name + ' element.');
			return false;
		}
	};

	function checkForExclusiveSymbols(value, exChars) {
		var
			containsExChar
		;

		containsExChar = false;

		if (typeof(exChars) != 'undefined' && exChars !== '') {
			var i = exChars.length;
			while (i--) {
				if (value.indexOf(exChars[i]) != -1) {
					containsExChar = true;

					return containsExChar;
				}
			}
		}
		return containsExChar;
	};
};

ValidateEngine.prototype.removeErrorSign = function(element) {
	$(element).removeClass('errorIcon');
	$(element).addClass('clearable');
};

ValidateEngine.prototype.addErrorSign = function(element) {
	$(element).removeClass('clearable');
	$(element).addClass('errorIcon');
};

ValidateEngine.prototype.validateFields = function() {
	var 
		_this = this,
		element
	;

	for(var id in _this.ids) {
		element = document.getElementById(id) || document.getElementsByName(id)[0];

		if(element.value === '' || element.className.indexOf(_this.checkForErrorClass)) {
			document.getElementById(_this.submitButtonID).disabled = true;
			validValues = false;
			break;
		} else { 
			validValues = true;
			document.getElementById(_this.submitButtonID).disabled = false;
		}
	}
};

ValidateEngine.prototype.applyDecimalBehaviour = function(element) {

	var 
		re = new RegExp('\_',"g")
	;

	element.value = element.value.replace(re, "0");
};