// input validator with builder pattern
class InputValidator {
    constructor(label, input) {
        this.input = input;
        this.label = label;
    }

    required(errorMessage = null) {
        if (!errorMessage) {
            errorMessage = `${this.label} is required`;
        }

        if (this.input === undefined || this.input === null || this.input === '') {
            throw new Error(errorMessage);
        }

        return this;
    }

    minLength(length, errorMessage = null) {
        if (!errorMessage) {
            errorMessage = `${this.label} must be at least ${length} characters long`;
        }
        if (this.input.length < length) {
            throw new Error(errorMessage);
        }
        return this;
    }

    maxLength(length, errorMessage = null) {
        if (!errorMessage) {
            errorMessage = `${this.label} must be at most ${length} characters long`;
        }
        if (this.input.length > length) {
            throw new Error(errorMessage);
        }
        return this;
    }

    isEmail(errorMessage = null) {
        if (!errorMessage) {
            errorMessage = `${this.label} must be a valid email address`;
        }  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.input)) {
            throw new Error(errorMessage);
        }
        return this;
    }

    isValidPassword(errorMessage = null) {
        if (!errorMessage) {
            errorMessage = `${this.label} must be a valid password (at least 8 characters, including uppercase, lowercase, number and special character)`;
        }
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        // if (!passwordRegex.test(this.input)) {
        //     throw new Error(errorMessage);
        // }
        return this;
    }

    validate() {
        return this.input;
    }
}

module.exports = InputValidator;
