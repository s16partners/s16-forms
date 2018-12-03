!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react")):"function"==typeof define&&define.amd?define(["react"],t):"object"==typeof exports?exports.Formsy=t(require("react")):e.Formsy=t(e.React)}("undefined"!=typeof self?self:this,function(e){return function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=3)}([function(e,t,n){e.exports=n(5)()},function(t,n){t.exports=e},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.default={arraysDiffer:function(e,t){var n=this,r=!1;return e.length!==t.length?r=!0:e.forEach(function(e,i){n.isSame(e,t[i])||(r=!0)},this),r},objectsDiffer:function(e,t){var n=this,r=!1;return Object.keys(e).length!==Object.keys(t).length?r=!0:Object.keys(e).forEach(function(i){n.isSame(e[i],t[i])||(r=!0)},this),r},isSame:function(e,t){return(void 0===e?"undefined":r(e))===(void 0===t?"undefined":r(t))&&(Array.isArray(e)&&Array.isArray(t)?!this.arraysDiffer(e,t):"function"==typeof e?e.toString()===t.toString():"object"===(void 0===e?"undefined":r(e))&&null!==e&&null!==t?!this.objectsDiffer(e,t):e===t)},find:function(e,t){for(var n=0,r=e.length;n<r;n+=1){var i=e[n];if(t(i))return i}return null},runRules:function(e,t,n,r){var i={errors:[],failed:[],success:[]};return Promise.all(Object.keys(n).map(function(o){if(r[o]&&"function"==typeof n[o])throw new Error("Formsy does not allow you to override default validations: "+o);if(!r[o]&&"function"!=typeof n[o])throw new Error("Formsy does not have the validation rule: "+o);return"function"==typeof n[o]?Promise.resolve(n[o](t,e)).then(function(e){"string"==typeof e?(i.errors.push(e),i.failed.push(o)):e||i.failed.push(o)}):"function"!=typeof n[o]?Promise.resolve(r[o](t,e,n[o])).then(function(e){"string"==typeof e?(i.errors.push(e),i.failed.push(o)):e?i.success.push(o):i.failed.push(o)}):i.success.push(o)})).then(function(){return i})}}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.Wrapper=t.withFormsy=t.validationRules=t.propTypes=t.addValidationRule=void 0;var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=function(){function e(e,t){var n=[],r=!0,i=!1,o=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){i=!0,o=e}finally{try{!r&&u.return&&u.return()}finally{if(i)throw o}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},c=n(4),d=r(c),p=n(0),m=r(p),h=n(1),v=r(h),y=n(2),b=r(y),g=n(9),V=r(g),E=n(10),O=r(E),S=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.getChildContext=function(){return{formsy:{attachToForm:n.attachToForm,detachFromForm:n.detachFromForm,validate:n.validate,isFormDisabled:n.isFormDisabled,isValidValue:function(e,t){return n.runValidation(e,t).isValid}}}},n.componentDidMount=function(){n.props.validateOnMount&&n.validateForm()},n.componentWillUpdate=function(){n.prevInputNames=n.inputs.map(function(e){return e.props.name})},n.componentDidUpdate=function(){n.props.validationErrors&&"object"===f(n.props.validationErrors)&&Object.keys(n.props.validationErrors).length>0&&n.setInputValidationErrors(n.props.validationErrors);var e=n.inputs.map(function(e){return e.props.name});b.default.arraysDiffer(n.prevInputNames,e)&&n.validateForm()},n.getCurrentValues=function(){return n.inputs.reduce(function(e,t){var n="object"===f(t.state.value)?Object.assign({},e):e;return n[t.props.name]=t.state.value,n},{})},n.getModel=function(){var e=n.getCurrentValues();return n.mapModel(e)},n.getPristineValues=function(){return n.inputs.reduce(function(e,t){var n=t.props.name,r="object"===f(t.state.value)?Object.assign({},e):e;return r[n]=t.props.value,r},{})},n.setFormPristine=function(e){n.setState({formSubmitted:!e}),n.inputs.forEach(function(t){t.setState({formSubmitted:!e,isPristine:e})})},n.setInputValidationErrors=function(e){n.inputs.forEach(function(t){var n=t.props.name,r=[{isValid:!(n in e),validationError:"string"==typeof e[n]?[e[n]]:e[n]}];t.setState.apply(t,r)}),!n.props.preventExternalInvalidation&&n.state.isValid&&n.setFormValidState(!1)},n.setFormValidState=function(e){n.setState({isValid:e}),e?n.props.onValid():n.props.onInvalid()},n.isFormDisabled=function(){return n.props.disabled},n.mapModel=function(e){return n.props.mapping?n.props.mapping(e):d.default.toObj(Object.keys(e).reduce(function(t,n){for(var r=n.split("."),i=t;r.length;){var o=r.shift();i[o]=r.length?i[o]||{}:e[n],i=i[o]}return t},{}))},n.reset=function(e){n.setFormPristine(!0),n.resetModel(e)},n.resetInternal=function(e){e.preventDefault(),n.reset(),n.props.onReset&&n.props.onReset()},n.resetModel=function(e){n.inputs.forEach(function(t){var n=t.props.name;e&&Object.prototype.hasOwnProperty.call(e,n)?t.setValue(e[n]):t.resetValue()}),n.validateForm()},n.runValidation=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.state.value,r=n.getCurrentValues(),i=e.props,o=i.validationError,a=i.validationErrors;return Promise.all([b.default.runRules(t,r,e.validations,V.default),b.default.runRules(t,r,e.requiredValidations,V.default)]).then(function(t){var r=l(t,2),i=r[0],u=r[1],s=Promise.resolve();return"function"==typeof e.validate&&(s=Promise.resolve(e.validate()).then(function(e){i.failed=e?[]:["failed"]})),s.then(function(){if(!(n.inputs.indexOf(e)<0)){var t=!!Object.keys(e.requiredValidations).length&&!!u.success.length,r=!(i.failed.length||n.props.validationErrors&&n.props.validationErrors[e.props.name]);return{isRequired:t,isValid:!t&&r,error:function(){if(r&&!t)return n.emptyArray;if(i.errors.length)return i.errors;if(n.props.validationErrors&&n.props.validationErrors[e.props.name])return"string"==typeof n.props.validationErrors[e.props.name]?[n.props.validationErrors[e.props.name]]:n.props.validationErrors[e.props.name];if(t){var s=a[u.success[0]];return s?[s]:null}return i.failed.length?i.failed.map(function(e){return a[e]?a[e]:o}).filter(function(e,t,n){return n.indexOf(e)===t}):void 0}.call(n)}}})})},n.attachToForm=function(e){-1===n.inputs.indexOf(e)&&n.inputs.push(e),n.props.validateOnMount&&n.validate(e)},n.detachFromForm=function(e){var t=n.inputs.indexOf(e);-1!==t&&(n.inputs=n.inputs.slice(0,t).concat(n.inputs.slice(t+1))),n.validateForm()},n.isChanged=function(){return!b.default.isSame(n.getPristineValues(),n.getCurrentValues())},n.submit=function(e){e&&e.preventDefault&&e.preventDefault(),n.setFormPristine(!1);var t=n.getModel();n.props.onSubmit(t,n.resetModel,n.updateInputsWithError),n.state.isValid?n.props.onValidSubmit(t,n.resetModel,n.updateInputsWithError):n.props.onInvalidSubmit(t,n.resetModel,n.updateInputsWithError)},n.updateInputsWithError=function(e,t){Object.keys(e).forEach(function(t){var r=b.default.find(n.inputs,function(e){return e.props.name===t});if(!r)throw new Error("You are trying to update an input that does not exist. Verify errors object with input names. "+JSON.stringify(e));var i=[{isValid:n.props.preventExternalInvalidation,externalError:"string"==typeof e[t]?[e[t]]:e[t]}];r.setState.apply(r,i)}),t&&n.state.isValid&&n.setFormValidState(!1)},n.onValidationComplete=function(){var e=n.inputs.every(function(e){return e.state.isValid});n.setFormValidState(e),n.setState({canChange:!0})},n.validate=function(e){n.state.canChange&&n.props.onChange(n.getCurrentValues(),n.isChanged()),n.runValidation(e).then(function(t){t&&e.setState({isValid:t.isValid,isRequired:t.isRequired,validationError:t.error,externalError:!t.isValid&&e.state.externalError?e.state.externalError:null},n.onValidationComplete)})},n.validateForm=function(){n.inputs.forEach(function(e,t){n.runValidation(e).then(function(r){r&&(r.isValid&&e.state.externalError&&(r.isValid=!1),e.setState({isValid:r.isValid,isRequired:r.isRequired,validationError:r.error,externalError:!r.isValid&&e.state.externalError?e.state.externalError:null},t===n.inputs.length-1?n.onValidationComplete:null))}),n.inputs.length||n.setState({canChange:!0})})},n.render=function(){var e=n.props,t=(e.getErrorMessage,e.getErrorMessages,e.getValue,e.hasValue,e.isFormDisabled,e.isFormSubmitted,e.isPristine,e.isRequired,e.isValid,e.isValidValue,e.mapping,e.onChange,e.onInvalidSubmit,e.onInvalid,e.onReset,e.onSubmit,e.onValid,e.onValidSubmit,e.preventExternalInvalidation,e.resetValue,e.setValidations,e.setValue,e.showError,e.showRequired,e.validationErrors,e.validateOnMount,i(e,["getErrorMessage","getErrorMessages","getValue","hasValue","isFormDisabled","isFormSubmitted","isPristine","isRequired","isValid","isValidValue","mapping","onChange","onInvalidSubmit","onInvalid","onReset","onSubmit","onValid","onValidSubmit","preventExternalInvalidation","resetValue","setValidations","setValue","showError","showRequired","validationErrors","validateOnMount"]));return v.default.createElement("form",s({onReset:n.resetInternal,onSubmit:n.submit},t,{disabled:!1}),n.props.children)},n.state={isValid:!0,isSubmitting:!1,canChange:!1},n.inputs=[],n.emptyArray=[],n}return u(t,e),t}(v.default.Component);S.displayName="Formsy",S.defaultProps={children:null,disabled:!1,getErrorMessage:function(){},getErrorMessages:function(){},getValue:function(){},hasValue:function(){},isFormDisabled:function(){},isFormSubmitted:function(){},isPristine:function(){},isRequired:function(){},isValid:function(){},isValidValue:function(){},mapping:null,onChange:function(){},onError:function(){},onInvalid:function(){},onInvalidSubmit:function(){},onReset:function(){},onSubmit:function(){},onValid:function(){},onValidSubmit:function(){},preventExternalInvalidation:!1,resetValue:function(){},setValidations:function(){},setValue:function(){},showError:function(){},showRequired:function(){},validationErrors:null,validateOnMount:!1},S.propTypes={children:m.default.node,disabled:m.default.bool,getErrorMessage:m.default.func,getErrorMessages:m.default.func,getValue:m.default.func,hasValue:m.default.func,isFormDisabled:m.default.func,isFormSubmitted:m.default.func,isPristine:m.default.func,isRequired:m.default.func,isValid:m.default.func,isValidValue:m.default.func,mapping:m.default.func,onChange:m.default.func,onInvalid:m.default.func,onInvalidSubmit:m.default.func,onReset:m.default.func,onSubmit:m.default.func,onValid:m.default.func,onValidSubmit:m.default.func,preventExternalInvalidation:m.default.bool,resetValue:m.default.func,setValidations:m.default.func,setValue:m.default.func,showError:m.default.func,showRequired:m.default.func,validationErrors:m.default.object,validateOnMount:m.default.bool},S.childContextTypes={formsy:m.default.object};var R=function(e,t){V.default[e]=t},x=O.default,j=!1,w=function(e){return j||(console.warn("Wrapper has been renamed to withFormsy. Importing Wrapper from formsy-react is depreacted and will be removed in the future. Please rename your Wrapper imports to withFormsy."),j=!0),x(e)};t.addValidationRule=R,t.propTypes=E.propTypes,t.validationRules=V.default,t.withFormsy=x,t.Wrapper=w,t.default=S},function(e,t){function n(e){return Object.keys(e).reduce(function(t,n){var r=n.match(/[^\[]*/i),i=n.match(/\[.*?\]/g)||[];i=[r[0]].concat(i).map(function(e){return e.replace(/\[|\]/g,"")});for(var o=t;i.length;){var a=i.shift();a in o?o=o[a]:(o[a]=i.length?isNaN(i[0])?{}:[]:e[n],o=o[a])}return t},{})}function r(e){function t(e,n,r){return Array.isArray(r)||"[object Object]"===Object.prototype.toString.call(r)?(Object.keys(r).forEach(function(i){t(e,n+"["+i+"]",r[i])}),e):(e[n]=r,e)}return Object.keys(e).reduce(function(n,r){return t(n,r,e[r])},{})}e.exports={fromObj:r,toObj:n}},function(e,t,n){"use strict";var r=n(6),i=n(7),o=n(8);e.exports=function(){function e(e,t,n,r,a,u){u!==o&&i(!1,"Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types")}function t(){return e}e.isRequired=e;var n={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t};return n.checkPropTypes=r,n.PropTypes=n,n}},function(e,t,n){"use strict";function r(e){return function(){return e}}var i=function(){};i.thatReturns=r,i.thatReturnsFalse=r(!1),i.thatReturnsTrue=r(!0),i.thatReturnsNull=r(null),i.thatReturnsThis=function(){return this},i.thatReturnsArgument=function(e){return e},e.exports=i},function(e,t,n){"use strict";function r(e,t,n,r,o,a,u,s){if(i(t),!e){var l;if(void 0===t)l=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var f=[n,r,o,a,u,s],c=0;l=new Error(t.replace(/%s/g,function(){return f[c++]})),l.name="Invariant Violation"}throw l.framesToPop=1,l}}var i=function(e){};e.exports=r},function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(e){return null!==e&&void 0!==e},i=function(e){return""===e},o={isDefaultRequiredValue:function(e,t){return void 0===t||null===t||""===t},isExisty:function(e,t){return r(t)},matchRegexp:function(e,t,n){return!r(t)||i(t)||n.test(t)},isUndefined:function(e,t){return void 0===t},isEmptyString:function(e,t){return i(t)},isEmail:function(e,t){return o.matchRegexp(e,t,/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i)},isUrl:function(e,t){return o.matchRegexp(e,t,/^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/i)},isTrue:function(e,t){return!0===t},isFalse:function(e,t){return!1===t},isNumeric:function(e,t){return"number"==typeof t||o.matchRegexp(e,t,/^[-+]?(?:\d*[.])?\d+$/)},isAlpha:function(e,t){return o.matchRegexp(e,t,/^[A-Z]+$/i)},isAlphanumeric:function(e,t){return o.matchRegexp(e,t,/^[0-9A-Z]+$/i)},isInt:function(e,t){return o.matchRegexp(e,t,/^(?:[-+]?(?:0|[1-9]\d*))$/)},isFloat:function(e,t){return o.matchRegexp(e,t,/^(?:[-+]?(?:\d+))?(?:\.\d*)?(?:[eE][+-]?(?:\d+))?$/)},isWords:function(e,t){return o.matchRegexp(e,t,/^[A-Z\s]+$/i)},isSpecialWords:function(e,t){return o.matchRegexp(e,t,/^[A-Z\s\u00C0-\u017F]+$/i)},isLength:function(e,t,n){return!r(t)||i(t)||t.length===n},equals:function(e,t,n){return!r(t)||i(t)||t===n},equalsField:function(e,t,n){return t===e[n]},maxLength:function(e,t,n){return!r(t)||t.length<=n},minLength:function(e,t,n){return!r(t)||i(t)||t.length>=n}};t.default=o},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.propTypes=void 0;var u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),f=r(l),c=n(1),d=r(c),p=n(2),m=r(p),h=function(e){return"string"==typeof e?e.split(/,(?![^{[]*[}\]])/g).reduce(function(e,t){var n=t.split(":"),r=n.shift();if(n=n.map(function(e){try{return JSON.parse(e)}catch(t){return e}}),n.length>1)throw new Error("Formsy does not support multiple args on string validations. Use object format of validations instead.");var i=Object.assign({},e);return i[r]=!n.length||n[0],i},{}):e||{}},v={innerRef:f.default.func,name:f.default.string.isRequired,required:f.default.oneOfType([f.default.bool,f.default.object,f.default.string]),validations:f.default.oneOfType([f.default.object,f.default.string]),value:f.default.any};t.propTypes=v,t.default=function(e){var t=function(t){function n(e){i(this,n);var t=o(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,e));return t.getErrorMessage=function(){var e=t.getErrorMessages();return e.length?e[0]:null},t.getErrorMessages=function(){return!t.isValid()||t.showRequired()?t.state.externalError||t.state.validationError||[]:[]},t.getValue=function(){return t.state.value},t.setValidations=function(e,n){t.validations=h(e)||{},t.requiredValidations=!0===n?{isDefaultRequiredValue:!0}:h(n)},t.setValue=function(e){arguments.length>1&&void 0!==arguments[1]&&!arguments[1]?t.setState({value:e}):t.setState({value:e,isPristine:!1},function(){t.context.formsy.validate(t)})},t.hasValue=function(){return""!==t.state.value},t.isFormDisabled=function(){return t.context.formsy.isFormDisabled()},t.isFormSubmitted=function(){return t.state.formSubmitted},t.isPristine=function(){return t.state.isPristine},t.isRequired=function(){return!!t.props.required},t.isValid=function(){return t.state.isValid},t.isValidValue=function(e){return t.context.formsy.isValidValue.call(null,t,e)},t.resetValue=function(){t.setState({value:t.state.pristineValue,isPristine:!0},function(){t.context.formsy.validate(t)})},t.showError=function(){return!t.showRequired()&&!t.isValid()},t.showRequired=function(){return t.state.isRequired},t.state={value:e.value,isRequired:!1,isValid:!0,isPristine:!0,pristineValue:e.value,validationError:[],externalError:null,formSubmitted:!1},t}return a(n,t),s(n,[{key:"componentDidMount",value:function(){var e=this;if(!this.props.name)throw new Error("Form Input requires a name property when used");!function(){e.setValidations(e.props.validations,e.props.required),e.context.formsy.attachToForm(e)}()}},{key:"shouldComponentUpdate",value:function(e,t){var n=this,r=Object.keys(this.props).some(function(t){return n.props[t]!==e[t]}),i=Object.keys(this.state).some(function(e){return n.state[e]!==t[e]});return r||i}},{key:"componentWillReceiveProps",value:function(e){this.setValidations(e.validations,e.required)}},{key:"componentDidUpdate",value:function(e){m.default.isSame(this.props.value,e.value)||this.setValue(this.props.value),m.default.isSame(this.props.validations,e.validations)&&m.default.isSame(this.props.required,e.required)||this.context.formsy.validate(this)}},{key:"componentWillUnmount",value:function(){this.context.formsy.detachFromForm(this)}},{key:"render",value:function(){var t=this.props.innerRef,n=u({getErrorMessage:this.getErrorMessage,getErrorMessages:this.getErrorMessages,getValue:this.getValue,hasValue:this.hasValue,isFormDisabled:this.isFormDisabled,isValid:this.isValid,isPristine:this.isPristine,isFormSubmitted:this.isFormSubmitted,isRequired:this.isRequired,isValidValue:this.isValidValue,resetValue:this.resetValue,setValidations:this.setValidations,setValue:this.setValue,showRequired:this.showRequired,showError:this.showError},this.props);return t&&(n.ref=t),d.default.createElement(e,n)}}]),n}(d.default.Component);return t.displayName="Formsy("+function(e){return e.displayName||e.name||("string"==typeof e?e:"Component")}(e)+")",t.contextTypes={formsy:f.default.object},t.defaultProps={innerRef:function(){},required:!1,validationError:"",validationErrors:{},validations:null,value:e.defaultValue},t.propTypes=v,t}}])});
//# sourceMappingURL=formsy-react.js.map