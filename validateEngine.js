"use strict";

window.onload = function() {

	var ve = new ValidateEngine();

	ve.initialize();
};

var ValidateEngine = function() {

	this.eventOnBlur = "blur";
	this.eventOnFocus = "focus";
};

ValidateEngine.prototype.initialize = function() {
	var
		inputElements,
		currentElement;

	inputElements = document.getElementsByTagName('input');

	for (var i = 0; i < inputElements.length; i++) {
		currentElement = inputElements[i];

		if (typeof(currentElement.attributes.type) != 'undefined' && currentElement.attributes.type.value.length >= 1 && typeof(VE.dataTypes[currentElement.attributes.type.value]) != 'undefined') {

			this.addListenerByElement(currentElement, VE.dataTypes[currentElement.attributes.type.value]);
		}
	}
};

ValidateEngine.prototype.addListenerByElement = function(element, dateTypeObj) {

	var _this = this;

	if (typeof(dateTypeObj.mask) != 'undefined') {
		Inputmask(dateTypeObj.mask).mask(element);
	}

	attachListener(element, function() {
		if (typeof(dateTypeObj.regex) != 'undefined') {
			_this.validateElement(element, dateTypeObj.regex);
		}
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
	}

	function tog(v) {
		return v ? 'addClass' : 'removeClass';
	}
};

ValidateEngine.prototype.validateElement = function(element, regex) {
	var re = new RegExp(regex, 'g');
	if (re.test(element.value)) {
		$(element).removeClass('errorIcon');
		$(element).addClass('clearable');
	} else if (element.value !== "") {
		$(element).removeClass('clearable');
		$(element).addClass('errorIcon');
	} else if (typeof(element.value) == "undefined") {
		throw 'Unable to validate ' + element.name + ' element.';
	}
};