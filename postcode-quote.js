$(document).ready(function () {
    $(".post-code-input").attr("maxlength", "4");

    function getStateFromPostcode(postcode) {
        const pc = parseInt(postcode, 10); 
        if(pc >= 3000 && pc <= 3999 || pc >= 8000 && pc <= 8999) return "VIC";
        if(pc >= 200 && pc <= 299 || pc >= 2600 && pc <= 2618 || pc >= 2900 && pc <= 2920) return "ACT";
        if(pc >= 1000 && pc <= 1999 || pc >= 2000 && pc <= 2599 || pc >= 2620 && pc <= 2899 || pc >= 2921 && pc <= 2999) return "NSW";
        if(pc >= 5000 && pc <= 5799 || pc >= 5800 && pc <= 5999) return "SA";
        if(pc >= 4000 && pc <= 4999 || pc >= 9000 && pc <= 9999) return "QLD";
        return null; 
    }

    function buildURL(postcode) {
        const url = new URL('https://amber.com.au/pricing');
        const urlParams = new URLSearchParams(window.location.search);

        // Set postcode
        urlParams.set('postcode', postcode);

        // Determine the state based on the postcode and set it if applicable
        const state = getStateFromPostcode(postcode);
        if(state) {
            urlParams.set("state", state);
        }

        url.search = urlParams.toString();

        return url.toString();
    }

    function handleSubmit(event) {
        event.preventDefault();

        const inputElement = document.getElementById('numberInput');
        const userInput = inputElement.value.trim();
        const invalidElement = document.getElementById('invalid');

        if (userInput === '') {
            console.log('Input is empty!');
            invalidElement.classList.add('no-code');
            return;
        }
        if (userInput.length !== 4) {
            console.log('Input is incorrect!');
            invalidElement.classList.add('no-code');
            return;
        }

        fetch('https://uploads-ssl.webflow.com/5be398fec98f64eddec9df1c/646db5b5ab7266fb0341af71_amber%20supported%20postcodes.txt')
            .then(response => response.text())
            .then(data => {
                const numberList = data.split('\n').map(number => parseInt(number));
                if (!numberList.includes(parseInt(userInput))) {
                    console.log('Input has no code match!');
                    invalidElement.classList.add('no-code');
                    return;
                }

                const url = buildURL(userInput);
                window.location.href = url;
            })
            .catch(error => {
                console.error('Error loading number list:', error);
            });
    }

    const formElement = document.getElementById('pcodeForm');
    formElement.addEventListener('submit', handleSubmit);

    function handleInput(event) {
        const inputElement = event.target;
        const inputValue = inputElement.value.trim();
        const invalidElement = document.getElementById('invalid');

        if (inputValue.length === 4) {
            fetch('https://uploads-ssl.webflow.com/5be398fec98f64eddec9df1c/646db5b5ab7266fb0341af71_amber%20supported%20postcodes.txt')
                .then(response => response.text())
                .then(data => {
                    const numberList = data.split('\n').map(number => parseInt(number));
                    if (!numberList.includes(parseInt(inputValue))) {
                        invalidElement.classList.add('no-code');
                    } else {
                        invalidElement.classList.remove('no-code');
                    }
                })
                .catch(error => {
                    console.error('Error loading number list:', error);
                });
        } else {
            invalidElement.classList.remove('no-code');
        }
    }

    const inputElement = document.getElementById('numberInput');
    inputElement.addEventListener('input', handleInput);

    function handleDocumentClick(event) {
        const formElement = document.getElementById('pcodeForm');
        const invalidElement = document.getElementById('invalid');

        if (!formElement.contains(event.target)) {
            invalidElement.classList.remove('no-code');
        }
    }

    document.addEventListener('click', handleDocumentClick);
});
