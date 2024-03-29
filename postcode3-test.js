$(document).ready(function () {
  $(".post-code-input").attr("maxlength", "4");
});


  // Select the forms
  const form1 = document.getElementById('pcodeForm1');
  const form2 = document.getElementById('pcodeForm2');
  const form3 = document.getElementById('pcodeForm3');
  const form4 = document.getElementById('pcodeForm4');

  function getCookie(name) {
    // This line will log the name of the cookie you're trying to get.
    console.log("Getting cookie for name:", name);

    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    // This line will log the raw match from the cookie string.
    console.log("Matches found:", matches);

    // Check if matches is not null and return the cookie value or undefined.
    let cookieValue = matches ? decodeURIComponent(matches[1]) : undefined;

    // This line will log the value of the cookie.
    console.log("Cookie value:", cookieValue);

    return cookieValue;
}


function buildURL(postcode) {
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get("utm_source");
  const utmMedium = urlParams.get("utm_medium");
  const utmCampaign = urlParams.get("utm_campaign");

  // Get coupon code from the cookie
  const cookieCouponCode = getCookie("coupon-code");
  console.log("Cookie coupon code:", cookieCouponCode);

  const currentPageURL = window.location.href;
  const hasCbaText = currentPageURL.includes('cba'); // Check if 'cba' is present in the URL

  const url = new URL("https://amber.com.au/pricing/");

  if (cookieCouponCode) {
      urlParams.set("couponcode", cookieCouponCode);
  } else {
      // Fallback to URL parameter if cookie is not present
      const couponCode = urlParams.get("couponcode");
      if (couponCode) {
          urlParams.set("couponcode", couponCode);
      }
  }
  
  urlParams.set("postcode", postcode);

  // Determine the state based on the postcode
  const state = getStateFromPostcode(postcode);
  if(state) {
    urlParams.set("state", state);
  }

  // Add '&cba_customer=true' only if 'cba' is present in the URL
  if (hasCbaText) {
      urlParams.set("cba_customer", "true");
  }

  url.search = urlParams.toString();

  console.log("Final URL with State:", url.toString());
  return url.toString();
}

// Helper function to determine the state based on the postcode
function getStateFromPostcode(postcode) {
  const pc = parseInt(postcode, 10); // Convert postcode to integer
  if(pc >= 3000 && pc <= 3999 || pc >= 8000 && pc <= 8999) return "VIC";
  if(pc >= 200 && pc <= 299 || pc >= 2600 && pc <= 2618 || pc >= 2900 && pc <= 2920) return "ACT";
  if(pc >= 1000 && pc <= 1999 || pc >= 2000 && pc <= 2599 || pc >= 2620 && pc <= 2899 || pc >= 2921 && pc <= 2999) return "NSW";
  if(pc >= 5000 && pc <= 5799 || pc >= 5800 && pc <= 5999) return "SA";
  if(pc >= 4000 && pc <= 4999 || pc >= 9000 && pc <= 9999) return "QLD";
  return null; // Return null if no state matches
}


  
function handleSubmit(event) {
  event.preventDefault();
  const clickedForm = event.target;


  const inputElement = document.getElementById("numberInput");
  // const userInput = inputElement.value.trim();
  // const invalidElement = document.getElementById("invalid");


  let invalidElement = "";
  let userInput = "";

  switch (clickedForm.id) {
      case 'pcodeForm1':
              invalidElement = document.getElementById('invalid1');
              userInput = document.getElementById('numberInput1');
          break;
      case 'pcodeForm2':
              invalidElement = document.getElementById('invalid2');
              userInput = document.getElementById('numberInput2');
          break;
      case 'pcodeForm3':
              invalidElement = document.getElementById('invalid3');
              userInput = document.getElementById('numberInput3');
          break;
      case 'pcodeForm4':
              invalidElement = document.getElementById('invalid4');
              userInput = document.getElementById('numberInput4');
          break;
  
      default:
          break;
  }



  if (userInput.value === "") {
    console.log("Input is empty!");
    invalidElement.classList.add("no-code");
    return;
  }
  if (userInput.value.length !== 4) {
    console.log("Input is incorrect!");
    invalidElement.classList.add("no-code");
    return;
  }

  fetch(
    "https://uploads-ssl.webflow.com/5be398fec98f64eddec9df1c/646db5b5ab7266fb0341af71_amber%20supported%20postcodes.txt"
  )
    .then((response) => response.text())
    .then((data) => {
      const numberList = data
        .split("\n")
        .map((number) => parseInt(number));
      if (!numberList.includes(parseInt(userInput.value))) {
        console.log("Input has no code match!");
        invalidElement.classList.add("no-code");
        return;
      }
      const url = buildURL(userInput.value);
      console.log("User input value:", userInput.value);

      window.location.href = url;
    })
    .catch((error) => {
      console.error("Error loading number list:", error);
    });
}


  // Attach the event listener to form1
  form1.addEventListener('submit', handleSubmit);
  // Attach the event listener to form2
  form2.addEventListener('submit', handleSubmit);
  // Attach the event listener to form3
  form3.addEventListener('submit', handleSubmit);
  // Attach the event listener to form4
  form4.addEventListener('submit', handleSubmit);

//   const formElement = document.getElementById("pcodeForm");
//   formElement.addEventListener("submit", handleSubmit);

function handleInput(event) {
  const inputElement = event.target;
  const inputValue = inputElement.value.trim();
  const invalidElement = document.getElementById("invalid");

  if (inputValue.length === 4) {
    fetch(
      "https://uploads-ssl.webflow.com/5be398fec98f64eddec9df1c/646db5b5ab7266fb0341af71_amber%20supported%20postcodes.txt"
    )
      .then((response) => response.text())
      .then((data) => {
        const numberList = data
          .split("\n")
          .map((number) => parseInt(number));
        if (!numberList.includes(parseInt(inputValue))) {
          invalidElement.classList.add("no-code");
        } else {
          invalidElement.classList.remove("no-code");
        }
      })
      .catch((error) => {
        console.error("Error loading number list:", error);
      });
  } else {
    invalidElement.classList.remove("no-code");
  }
}

const inputElement = document.getElementById("numberInput");
inputElement.addEventListener("input", handleInput);

function handleDocumentClick(event) {
  const formElement = document.getElementById("pcodeForm");
  const invalidElement = document.getElementById("invalid");

  if (!formElement.contains(event.target)) {
    invalidElement.classList.remove("no-code");
  }
}

document.addEventListener("click", handleDocumentClick);

