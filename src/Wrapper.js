import PropTypes from "prop-types";
import React from "react";
import utils from "./utils";

/* eslint-disable react/default-props-match-prop-types */

const convertValidationsToObject = validations => {
  if (typeof validations === "string") {
    return validations
      .split(/,(?![^{[]*[}\]])/g)
      .reduce((validationsAccumulator, validation) => {
        let args = validation.split(":");
        const validateMethod = args.shift();

        args = args.map(arg => {
          try {
            return JSON.parse(arg);
          } catch (e) {
            return arg; // It is a string if it can not parse it
          }
        });

        if (args.length > 1) {
          throw new Error(
            "Formsy does not support multiple args on string validations. Use object format of validations instead."
          );
        }

        // Avoid parameter reassignment
        const validationsAccumulatorCopy = Object.assign(
          {},
          validationsAccumulator
        );
        validationsAccumulatorCopy[validateMethod] = args.length
          ? args[0]
          : true;
        return validationsAccumulatorCopy;
      }, {});
  }

  return validations || {};
};

const propTypes = {
  innerRef: PropTypes.func,
  name: PropTypes.string.isRequired,
  required: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.string
  ]),
  validations: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  value: PropTypes.any // eslint-disable-line react/forbid-prop-types
};

export { propTypes };

export default Component => {
  class WrappedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: props.value,
        isRequired: false,
        isValid: true,
        isPristine: true,
        pristineValue: props.value,
        validationError: [],
        externalError: null,
        formSubmitted: false
      };
    }

    componentDidMount() {
      const configure = () => {
        this.setValidations(this.props.validations, this.props.required);

        // Pass a function instead?
        this.context.formsy.attachToForm(this);
      };

      if (!this.props.name) {
        throw new Error("Form Input requires a name property when used");
      }

      configure();
    }

    shouldComponentUpdate(nextProps, nextState) {
      const isPropsChanged = Object.keys(this.props).some(
        k => this.props[k] !== nextProps[k]
      );
      const isStateChanged = Object.keys(this.state).some(
        k => this.state[k] !== nextState[k]
      );
      return isPropsChanged || isStateChanged;
    }

    // We have to make sure the validate method is kept when new props are added
    componentWillReceiveProps(nextProps) {
      this.setValidations(nextProps.validations, nextProps.required);
    }

    componentDidUpdate(prevProps) {
      // If the value passed has changed, set it. If value is not passed it will
      // internally update, and this will never run
      if (!utils.isSame(this.props.value, prevProps.value)) {
        this.setValue(this.props.value);
      }

      // If validations or required is changed, run a new validation
      if (
        !utils.isSame(this.props.validations, prevProps.validations) ||
        !utils.isSame(this.props.required, prevProps.required)
      ) {
        this.context.formsy.validate(this);
      }
    }

    // Detach it when component unmounts
    componentWillUnmount() {
      this.context.formsy.detachFromForm(this);
    }

    getErrorMessage = () => {
      const messages = this.getErrorMessages();
      return messages.length ? messages[0] : null;
    };

    getErrorMessages = () => {
      if (!this.isValid() || this.showRequired()) {
        return this.state.externalError || this.state.validationError || [];
      }
      return [];
    };

    getValue = () => this.state.value;

    setValidations = (validations, required) => {
      // Add validations to the store itself as the props object can not be modified
      this.validations = convertValidationsToObject(validations) || {};
      this.requiredValidations =
        required === true
          ? { isDefaultRequiredValue: true }
          : convertValidationsToObject(required);
    };

    // By default, we validate after the value has been set.
    // A user can override this and pass a second parameter of `false` to skip validation.
    setValue = (value, validate = true) => {
      if (!validate) {
        this.setState({
          value
        });
      } else {
        this.setState(
          {
            value,
            isPristine: false
          },
          () => {
            this.context.formsy.validate(this);
          }
        );
      }
    };

    hasValue = () => this.state.value !== "";

    isFormDisabled = () => this.context.formsy.isFormDisabled();

    isFormSubmitted = () => this.state.formSubmitted;

    isPristine = () => this.state.isPristine;

    isRequired = () => !!this.props.required;

    isValid = () => this.state.isValid;

    isValidValue = value =>
      this.context.formsy.isValidValue.call(null, this, value);

    resetValue = () => {
      this.setState(
        {
          value: this.state.pristineValue,
          isPristine: true
        },
        () => {
          this.context.formsy.validate(this);
        }
      );
    };

    showError = () => !this.showRequired() && !this.isValid();

    showRequired = () => this.state.isRequired;

    render() {
      const { innerRef } = this.props;
      const propsForElement = {
        getErrorMessage: this.getErrorMessage,
        getErrorMessages: this.getErrorMessages,
        getValue: this.getValue,
        hasValue: this.hasValue,
        isFormDisabled: this.isFormDisabled,
        isValid: this.isValid,
        isPristine: this.isPristine,
        isFormSubmitted: this.isFormSubmitted,
        isRequired: this.isRequired,
        isValidValue: this.isValidValue,
        resetValue: this.resetValue,
        setValidations: this.setValidations,
        setValue: this.setValue,
        showRequired: this.showRequired,
        showError: this.showError,
        ...this.props
      };

      if (innerRef) {
        propsForElement.ref = innerRef;
      }

      return React.createElement(Component, propsForElement);
    }
  }

  function getDisplayName(component) {
    return (
      component.displayName ||
      component.name ||
      (typeof component === "string" ? component : "Component")
    );
  }

  WrappedComponent.displayName = `Formsy(${getDisplayName(Component)})`;

  WrappedComponent.contextTypes = {
    formsy: PropTypes.object // What about required?
  };

  WrappedComponent.defaultProps = {
    innerRef: () => {},
    required: false,
    validationError: "",
    validationErrors: {},
    validations: null,
    value: Component.defaultValue
  };

  WrappedComponent.propTypes = propTypes;

  return WrappedComponent;
};
