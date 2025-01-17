import formDataToObject from "form-data-to-object";
import PropTypes from "prop-types";
import React from "react";

import utils from "./utils";
import validationRules from "./validationRules";
import Wrapper, { propTypes } from "./Wrapper";

/* eslint-disable react/no-unused-state, react/default-props-match-prop-types */

class Formsy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: true,
      isSubmitting: false,
      canChange: false
    };
    this.inputs = [];
    this.emptyArray = [];
  }

  getChildContext = () => ({
    formsy: {
      attachToForm: this.attachToForm,
      detachFromForm: this.detachFromForm,
      validate: this.validate,
      isFormDisabled: this.isFormDisabled,
      isValidValue: (component, value) =>
        this.runValidation(component, value).isValid
    }
  });

  componentDidMount = () => {
    if (this.props.validateOnMount) this.validateForm();
  };

  componentWillUpdate = () => {
    // Keep a reference to input names before form updates,
    // to check if inputs has changed after render
    this.prevInputNames = this.inputs.map(component => component.props.name);
  };

  componentDidUpdate = () => {
    if (
      this.props.validationErrors &&
      typeof this.props.validationErrors === "object" &&
      Object.keys(this.props.validationErrors).length > 0
    ) {
      this.setInputValidationErrors(this.props.validationErrors);
    }

    const newInputNames = this.inputs.map(component => component.props.name);
    if (utils.arraysDiffer(this.prevInputNames, newInputNames)) {
      this.validateForm();
    }
  };

  getCurrentValues = () =>
    this.inputs.reduce((data, component) => {
      const dataCopy =
        typeof component.state.value === "object"
          ? Object.assign({}, data)
          : data; // avoid param reassignment
      dataCopy[component.props.name] = component.state.value;
      return dataCopy;
    }, {});

  getModel = () => {
    const currentValues = this.getCurrentValues();
    return this.mapModel(currentValues);
  };

  getPristineValues = () =>
    this.inputs.reduce((data, component) => {
      const { name } = component.props;
      const dataCopy =
        typeof component.state.value === "object"
          ? Object.assign({}, data)
          : data; // avoid param reassignment
      dataCopy[name] = component.props.value;
      return dataCopy;
    }, {});

  setFormPristine = isPristine => {
    this.setState({
      formSubmitted: !isPristine
    });

    // Iterate through each component and set it as pristine
    // or "dirty".
    this.inputs.forEach(component => {
      component.setState({
        formSubmitted: !isPristine,
        isPristine
      });
    });
  };

  setInputValidationErrors = errors => {
    this.inputs.forEach(component => {
      const { name } = component.props;
      const args = [
        {
          isValid: !(name in errors),
          validationError:
            typeof errors[name] === "string" ? [errors[name]] : errors[name]
        }
      ];
      component.setState(...args);
    });
    if (!this.props.preventExternalInvalidation && this.state.isValid) {
      this.setFormValidState(false);
    }
  };

  setFormValidState = allIsValid => {
    this.setState({
      isValid: allIsValid
    });
    if (allIsValid) {
      this.props.onValid();
    } else {
      this.props.onInvalid();
    }
  };

  isFormDisabled = () => this.props.disabled;

  mapModel = model => {
    if (this.props.mapping) {
      return this.props.mapping(model);
    }

    return formDataToObject.toObj(
      Object.keys(model).reduce((mappedModel, key) => {
        const keyArray = key.split(".");
        let base = mappedModel;
        while (keyArray.length) {
          const currentKey = keyArray.shift();
          base[currentKey] = keyArray.length
            ? base[currentKey] || {}
            : model[key];
          base = base[currentKey];
        }
        return mappedModel;
      }, {})
    );
  };

  reset = data => {
    this.setFormPristine(true);
    this.resetModel(data);
  };

  resetInternal = event => {
    event.preventDefault();
    this.reset();
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  // Reset each key in the model to the original / initial / specified value
  resetModel = data => {
    this.inputs.forEach(component => {
      const { name } = component.props;
      if (data && Object.prototype.hasOwnProperty.call(data, name)) {
        component.setValue(data[name]);
      } else {
        component.resetValue();
      }
    });
    this.validateForm();
  };

  // Checks validation on current value or a passed value
  runValidation = (component, value = component.state.value) => {
    const currentValues = this.getCurrentValues();
    const { validationError, validationErrors } = component.props;

    return Promise.all([
      utils.runRules(
        value,
        currentValues,
        component.validations,
        validationRules
      ),
      utils.runRules(
        value,
        currentValues,
        component.requiredValidations,
        validationRules
      )
    ]).then(([validationResults, requiredResults]) => {
      let validateComponent = Promise.resolve();

      if (typeof component.validate === "function") {
        validateComponent = Promise.resolve(component.validate()).then(
          validated => {
            validationResults.failed = validated ? [] : ["failed"];
          }
        );
      }

      return validateComponent.then(() => {
        if (this.inputs.indexOf(component) < 0) {
          return;
        }
        const isRequired = Object.keys(component.requiredValidations).length
          ? !!requiredResults.success.length
          : false;
        const isValid =
          !validationResults.failed.length &&
          !(
            this.props.validationErrors &&
            this.props.validationErrors[component.props.name]
          );

        return {
          isRequired,
          isValid: isRequired ? false : isValid,
          error: (() => {
            if (isValid && !isRequired) {
              return this.emptyArray;
            }

            if (validationResults.errors.length) {
              return validationResults.errors;
            }

            if (
              this.props.validationErrors &&
              this.props.validationErrors[component.props.name]
            ) {
              return typeof this.props.validationErrors[
                component.props.name
              ] === "string"
                ? [this.props.validationErrors[component.props.name]]
                : this.props.validationErrors[component.props.name];
            }

            if (isRequired) {
              const error = validationErrors[requiredResults.success[0]];
              return error ? [error] : null;
            }

            if (validationResults.failed.length) {
              return validationResults.failed
                .map(failed =>
                  validationErrors[failed]
                    ? validationErrors[failed]
                    : validationError
                )
                .filter((x, pos, arr) => arr.indexOf(x) === pos); // remove duplicates
            }
          }).call(this)
        };
      });
    });
  };

  // Method put on each input component to register
  // itself to the form
  attachToForm = component => {
    if (this.inputs.indexOf(component) === -1) {
      this.inputs.push(component);
    }
    if (this.props.validateOnMount) this.validate(component);
  };

  // Method put on each input component to unregister
  // itself from the form
  detachFromForm = component => {
    const componentPos = this.inputs.indexOf(component);

    if (componentPos !== -1) {
      this.inputs = this.inputs
        .slice(0, componentPos)
        .concat(this.inputs.slice(componentPos + 1));
    }

    this.validateForm();
  };

  // Checks if the values have changed from their initial value
  isChanged = () =>
    !utils.isSame(this.getPristineValues(), this.getCurrentValues());

  // Update model, submit to url prop and send the model
  submit = event => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    // Trigger form as not pristine.
    // If any inputs have not been touched yet this will make them dirty
    // so validation becomes visible (if based on isPristine)
    this.setFormPristine(false);
    const model = this.getModel();
    this.props.onSubmit(model, this.resetModel, this.updateInputsWithError);
    if (this.state.isValid) {
      this.props.onValidSubmit(
        model,
        this.resetModel,
        this.updateInputsWithError
      );
    } else {
      this.props.onInvalidSubmit(
        model,
        this.resetModel,
        this.updateInputsWithError
      );
    }
  };

  // Go through errors from server and grab the components
  // stored in the inputs map. Change their state to invalid
  // and set the serverError message
  updateInputsWithError = (errors, invalidate) => {
    Object.keys(errors).forEach(name => {
      const component = utils.find(
        this.inputs,
        input => input.props.name === name
      );
      if (!component) {
        throw new Error(
          `You are trying to update an input that does not exist. Verify errors object with input names. ${JSON.stringify(
            errors
          )}`
        );
      }
      const args = [
        {
          isValid: this.props.preventExternalInvalidation,
          externalError:
            typeof errors[name] === "string" ? [errors[name]] : errors[name]
        }
      ];
      component.setState(...args);
    });
    if (invalidate && this.state.isValid) {
      this.setFormValidState(false);
    }
  };

  onValidationComplete = () => {
    const allIsValid = this.inputs.every(component => component.state.isValid);

    this.setFormValidState(allIsValid);
    // Tell the form that it can start to trigger change events
    this.setState({
      canChange: true
    });
  };

  // Use the binded values and the actual input value to
  // validate the input and set its state. Then check the
  // state of the form itself
  validate = component => {
    // Trigger onChange
    if (this.state.canChange) {
      this.props.onChange(this.getCurrentValues(), this.isChanged());
    }

    this.runValidation(component).then(validation => {
      if (!validation) return;
      // Run through the validations, split them up and call
      // the validator IF there is a value or it is required
      component.setState(
        {
          isValid: validation.isValid,
          isRequired: validation.isRequired,
          validationError: validation.error,
          externalError:
            !validation.isValid && component.state.externalError
              ? component.state.externalError
              : null
        },
        this.onValidationComplete
      );
    });
  };

  // Validate the form by going through all child input components
  // and check their state
  validateForm = () => {
    // We need a callback as we are validating all inputs again. This will
    // run when the last component has set its state
    const onValidationComplete = () => {
      const allIsValid = this.inputs.every(
        component => component.state.isValid
      );

      this.setState({
        isValid: allIsValid
      });

      if (allIsValid) {
        this.props.onValid();
      } else {
        this.props.onInvalid();
      }

      // Tell the form that it can start to trigger change events
      this.setState({
        canChange: true
      });
    };

    // Run validation again in case affected by other inputs. The
    // last component validated will run the onValidationComplete callback
    this.inputs.forEach((component, index) => {
      this.runValidation(component).then(validation => {
        if (!validation) return;
        if (validation.isValid && component.state.externalError) {
          validation.isValid = false;
        }
        component.setState(
          {
            isValid: validation.isValid,
            isRequired: validation.isRequired,
            validationError: validation.error,
            externalError:
              !validation.isValid && component.state.externalError
                ? component.state.externalError
                : null
          },
          index === this.inputs.length - 1 ? this.onValidationComplete : null
        );
      });

      // If there are no inputs, set state where form is ready to trigger
      // change event. New inputs might be added later
      if (!this.inputs.length) {
        this.setState({
          canChange: true
        });
      }
    });
  };

  render = () => {
    const {
      getErrorMessage,
      getErrorMessages,
      getValue,
      hasValue,
      isFormDisabled,
      isFormSubmitted,
      isPristine,
      isRequired,
      isValid,
      isValidValue,
      mapping,
      onChange,
      // onError,
      onInvalidSubmit,
      onInvalid,
      onReset,
      onSubmit,
      onValid,
      onValidSubmit,
      preventExternalInvalidation,
      // reset,
      resetValue,
      setValidations,
      setValue,
      showError,
      showRequired,
      validationErrors,
      validateOnMount,
      ...nonFormsyProps
    } = this.props;

    return React.createElement(
      "form",
      {
        onReset: this.resetInternal,
        onSubmit: this.submit,
        ...nonFormsyProps,
        disabled: false
      },
      this.props.children
    );
  };
}

Formsy.displayName = "Formsy";

Formsy.defaultProps = {
  children: null,
  disabled: false,
  getErrorMessage: () => {},
  getErrorMessages: () => {},
  getValue: () => {},
  hasValue: () => {},
  isFormDisabled: () => {},
  isFormSubmitted: () => {},
  isPristine: () => {},
  isRequired: () => {},
  isValid: () => {},
  isValidValue: () => {},
  mapping: null,
  onChange: () => {},
  onError: () => {},
  onInvalid: () => {},
  onInvalidSubmit: () => {},
  onReset: () => {},
  onSubmit: () => {},
  onValid: () => {},
  onValidSubmit: () => {},
  preventExternalInvalidation: false,
  resetValue: () => {},
  setValidations: () => {},
  setValue: () => {},
  showError: () => {},
  showRequired: () => {},
  validationErrors: null,
  validateOnMount: false
};

Formsy.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  getErrorMessage: PropTypes.func,
  getErrorMessages: PropTypes.func,
  getValue: PropTypes.func,
  hasValue: PropTypes.func,
  isFormDisabled: PropTypes.func,
  isFormSubmitted: PropTypes.func,
  isPristine: PropTypes.func,
  isRequired: PropTypes.func,
  isValid: PropTypes.func,
  isValidValue: PropTypes.func,
  mapping: PropTypes.func,
  onChange: PropTypes.func,
  onInvalid: PropTypes.func,
  onInvalidSubmit: PropTypes.func,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func,
  onValid: PropTypes.func,
  onValidSubmit: PropTypes.func,
  preventExternalInvalidation: PropTypes.bool,
  resetValue: PropTypes.func,
  setValidations: PropTypes.func,
  setValue: PropTypes.func,
  showError: PropTypes.func,
  showRequired: PropTypes.func,
  validationErrors: PropTypes.object, // eslint-disable-line,
  validateOnMount: PropTypes.bool
};

Formsy.childContextTypes = {
  formsy: PropTypes.object
};

const addValidationRule = (name, func) => {
  validationRules[name] = func;
};

const withFormsy = Wrapper;

let didWarnAboutWrapperDeprecation = false;

const deprecatedWrapper = Component => {
  if (!didWarnAboutWrapperDeprecation) {
    // eslint-disable-next-line no-console
    console.warn(
      "Wrapper has been renamed to withFormsy. Importing Wrapper from formsy-react is depreacted and will be removed in the future. Please rename your Wrapper imports to withFormsy."
    );
    didWarnAboutWrapperDeprecation = true;
  }

  return withFormsy(Component);
};

export {
  addValidationRule,
  propTypes,
  validationRules,
  withFormsy,
  deprecatedWrapper as Wrapper
};

export default Formsy;
