function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + expirationDate.toUTCString();
    const domain = "domain=amber.com.au";
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/;" + domain;
  }
  
  function getCookie(name) {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return "";
  }
  
  function handleSubmit(event) {
    event.preventDefault();
  
    const inputElement = document.querySelectorAll('.is-bau-pcode-input, .is-bau-pcode-input-2, .is-bau-pcode-input-3, .is-bau-pcode-input-4');
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
  
        setCookie('postcode', userInput, 1); // Cookie will expire in 1 day
  
        window.location.href = 'https://amber.com.au/pricing';
      })
      .catch(error => {
        console.error('Error loading number list:', error);
      });
  }
  
  const formElement = document.querySelectorAll('.is-bau-form, .is-bau-form-2, .is-bau-form-3, .is-bau-form-4');
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
  
  const inputElement = document.querySelectorAll('.is-bau-pcode-input, .is-bau-pcode-input-2, .is-bau-pcode-input-3, .is-bau-pcode-input-4');
  inputElement.addEventListener('input', handleInput);
  
  function handleDocumentClick(event) {
    const formElement = document.querySelectorAll('.is-bau-form, .is-bau-form-2, .is-bau-form-3, .is-bau-form-4');
    const invalidElement = document.getElementById('invalid');
  
    if (!formElement.contains(event.target)) {
      invalidElement.classList.remove('no-code');
    }
  }
  
  document.addEventListener('click', handleDocumentClick);
  