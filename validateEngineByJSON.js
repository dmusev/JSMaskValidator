/**
 *  Validate Engine. Enter pointer
 * =============================================================
 * @author Dimtiar Musev, Sofia, Bulgaria
 * Last edit: 19.10.2016
 *
 * Made for validating fields by given json 
 * 
 * @gameProducer EGT
 * @version      2.0
 *
 * © 2016 Euro Games Technology. http://www.egt-bg.com
 *  All rights reserved.
 *  
 */

//-------------------------------------------------------------------------------------
(function() {
    "use strict";
    /**
     * Validate Engine Class
     * @type {Function} 
     */

    var ValidateEngine = function(json) {

        this.eventOnBlur = "blur";
        this.eventOnFocus = "focus";
        this.jsonData = JSON.parse(json);
        this.ids = this.jsonData.ids;
        this.submitButtonID = this.jsonData.buttons.submit;
        this.errorClass = 'errorIcon';
    };
    /**
     * Initiliaze
     */
    ValidateEngine.prototype._initialize = function() {
        var
            _this = this,
            givenDataTypes = {};
        //Initial validation of the fields. Assure they are empty and disable submit button
        _this._validateFields();

        //Associate array
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
            //Associate array by ids and add listeners for the avaialble data type properties
        for (var id in _this.ids) {
            if (_this.ids.hasOwnProperty(id)) {
                var dataTypeProperties = givenDataTypes[_this.ids[id]];
                var element = document.getElementById(id) || document.getElementsByName(id)[0];
                if (typeof(element) != 'undefined' && typeof(dataTypeProperties) != 'undefined') {
                    //Function adding a listener to particular element and datatype properties
                    this._addListenerByElement(element, dataTypeProperties);
                } else {
                    console.warn('Element with id: ' + id + " cannot be properly masked/validated !");
                }
            }
        }
    };
    /**
     * A main add listener function consisted of secondary function to attach a listener
     * to the passed element
     * 
     * @param {[type]} element     
     * @param {[type]} dateTypeObj
     */
    ValidateEngine.prototype._addListenerByElement = function(element, dateTypeObj) {

        var
            _this = this;

        if (typeof(dateTypeObj.mask) != 'undefined' && dateTypeObj.mask !== '') {
            Inputmask(dateTypeObj.mask).mask(element);
        } else if (typeof(dateTypeObj.custom) != 'undefined' && dateTypeObj.custom !== '') {
            setCustomMask(dateTypeObj.custom, element, _this);
        }

        //Attach listener function called for element 
        //and a handler function to be executed on event(validate element which is also private function)
        attachListener(element, function() {
            _this._validateElement(element, dateTypeObj);
        });

        /**
         * Attach all listeners to the element and its behaviours
         * @param  {[type]} element         
         * @param  {[type]} functionHandler [A function to be executed on event]
         */
        function attachListener(element, functionHandler) {
            element.addEventListener(_this.eventOnBlur, functionHandler);

            element.className += ' clearable';

            $(element).
            on('input', function() {
                $(element)[tog(element.value)]('x');
            }).
            on('keypress', function() {
                $(element)[tog(element.value)]('x');
                $(element).removeClass('errorIcon');
                $(element).addClass('clearable');
            });

            $(document).
            on('mousemove', '.x', function(e) {
                e.preventDefault();
                $(e.target)[tog(element.offsetWidth - 18 < e.clientX - element.getBoundingClientRect().left)]('onX');
            }).
            on('touchstart click', '.onX', function(e) {
                e.preventDefault();
                $(e.target).removeClass('x onX').val('').change(_this._validateFields());
            });

            function tog(v) {
                return v ? 'addClass' : 'removeClass';
            }
        }
        /**
         * Function defining a custom mask when there is not typical mask passed
         * @param {[type]} custom  
         * @param {[type]} element
         * @param {[type]} _this
         */
        function setCustomMask(custom, element, _this) {

            var
                customTypeObj = custom.type,
                customTypes = custom.type.split(','),
                customMask = '',
                typeDelimiter = custom.delimiter ? custom.delimiter.split('') : '',
                customMinLength = custom.minLength ? custom.minLength.split(',') : '1',
                customMaxLength = custom.maxLength ? custom.maxLength.split(',') : '9';

            //Creating custom mask by given mask parameters
            for (var i = 0; i < customTypes.length; i++) {
                customMask += customTypes[i] + '{' + (customMinLength[i] ? customMinLength[i] : '1') + ',' + (customMaxLength[i] ? customMaxLength[i] : '9') + '}' + (typeDelimiter[i] ? typeDelimiter[i] : '');
            }

            Inputmask(customMask, {
                oncomplete: function(buffer, opts) {
                    //Remove error sign
                    _this._removeErrorSign(element);
                },
                onincomplete: function(buffer, opts) {
                    if (customTypeObj.indexOf('a') >= 0) {
                        //Add error sign
                        _this._addErrorSign(element);
                    } else {
                        //Apply decimal behaviour(eg: fulfil with zeros if not full decimal number)
                        _this._applyDecimalBehaviour(element, typeDelimiter);
                    }
                },
                clearMaskOnLostFocus: true
            }).
            mask(element);
        };
    };

    /**
     * Validating element/Validate through regex(if not available then for exclusive symbols)
     * @param  {[type]} element     [description]
     * @param  {[type]} dateTypeObj [description]
     */
    ValidateEngine.prototype._validateElement = function(element, dateTypeObj) {
        var
            _this = this;

        if (checkRegex(element, dateTypeObj.regex) || checkForExclusiveSymbols(element.value, dateTypeObj.exclude)) {
            //Add error sign
            _this._addErrorSign(element);
        } else {
            //Remove error sign
            _this._removeErrorSign(element);
        }

        //Validate element value by given regex
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

        //Check for given exclusive symbols in element's value
        function checkForExclusiveSymbols(value, exChars) {
            var
                containsExChar;

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

    /**
     * Basic function for removing already asigned error sign
     * @param  {[type]} element [description]
     */
    ValidateEngine.prototype._removeErrorSign = function(element) {
        $(element).removeClass('errorIcon');
        $(element).addClass('clearable');
        this._validateFields();
    };

    /**
     * Attach error sign
     * @param {[type]} element [description]
     */
    ValidateEngine.prototype._addErrorSign = function(element) {
        $(element).removeClass('clearable');
        $(element).addClass('errorIcon');
    };

    /**
     * Validate fields by set of ids
     * @return {[type]} [description]
     */
    ValidateEngine.prototype._validateFields = function() {
        var
            _this = this,
            element;

        for (var id in _this.ids) {
            element = document.getElementById(id) || document.getElementsByName(id)[0];

            if (element.value === '' || element.className.indexOf(_this.errorClass) > -1) {
                //Disable button by id
                document.getElementById(_this.submitButtonID).disabled = true;
                //Global variable standing for valid or not fotm
                window.validForm = false;
                break;
            } else {
                //Global variable standing for valid or not fotm 
                window.validForm = true;
                //Enable button by id
                document.getElementById(_this.submitButtonID).disabled = false;
            }
        }
    };

    /**
     * Applying behaviour of a decimal or just fulfilling the number if not full.
     * @param  {[type]} element [description]
     */
    ValidateEngine.prototype._applyDecimalBehaviour = function(element) {

        var
            re = new RegExp('\_', "g");

        element.value = element.value.replace(re, "0");
    };



    /**
     * Enter pointer.
     * @type {Function}
     */
    var
        validateEngine;
    validateEngine = new ValidateEngine(window.json);

    window.addEventListener('load', function go(e) {
        validateEngine._initialize();
    }, false);


})()