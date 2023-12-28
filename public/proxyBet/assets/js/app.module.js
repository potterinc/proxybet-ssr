class AppModule {

    constructor() { }

    // Base API url
    BASE_URI = 'http://localhost:3000/api/';

    // Form Validator
    validateField(inputArgs) {
        let validInput = $(`[${inputArgs}]`);
        for (let formControl = 0; formControl < validInput.length; formControl++) {
            if (validInput.get(formControl).value == null || validInput.get(formControl).value == '') {
                validInput[formControl].placeholder = 'This field is required';
                validInput[formControl].style.borderWidth = '5px';
                validInput[formControl].style.borderStyle = 'solid';
                validInput[formControl].style.borderLeftColor = '#a00';
                return false;
            }
        }
        return true;
    }
}

export default AppModule