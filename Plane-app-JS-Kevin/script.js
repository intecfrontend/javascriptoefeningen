const today = new Date();
const startingPrice = 1000;
let openSeatsOnPlane = 10;
let ticketsSold = 0;
const buyerName = document.querySelector("#input-name");
const outputPrice = document.querySelector("#output-price");
const outputSeats = document.querySelector("#output-seats");
const inputDate = document.querySelector("#input-date");
const dayInMilliSeconds = 86400000;
let arrayDaysBetween = new Array();
let arrayFridays = new Array();
let stillSamePerson = false;

inputDate.value = today.toISOString().substring(0, 10); //since we need a value of the type YYYY-MM-DD to set value
inputDate.min = today.toISOString().substring(0, 10); // same type needed YYYY-MM-DD to set "min" value inside HTML inputDate label.
outputSeats.value = openSeatsOnPlane; //sets starting value of available tickets in the browser "#output-seats"

//function to calculate days - needs to return the diffdays variable to use it in another function
function checkDaysBetweenTodayAndFlyDate() {
  let flyDate = inputDate.valueAsDate;
  let timeDiff = Math.abs(flyDate.getTime() - today.getTime());
  let diffDays = Math.ceil(timeDiff / dayInMilliSeconds);
  return diffDays;
}

function makeCalculations() {
  let dayCounter = 1;
  let finalPriceAfterCheck = 0;
  let dayPrice = 0;
  let daysBetween = checkDaysBetweenTodayAndFlyDate(); //here we call the function above which returns diffdays and we store it in the variable daysBetween.
  const firstDiscount = 0.01; // 1% reduction per day
  const secondDiscount = 0.1; // 10% reduction per ticket sold
  let priceWithFirstDiscount = 0;

  if (stillSamePerson == false) {
    //check if there were already calculations made, without clicking the booking-button (if the user wants to calc another price for example) - THIS DOESNT WORK CORRECTLY YET

    if (buyerName.value != "") {
      //check if username is filled in

      while (dayCounter <= daysBetween) {
        console.log('got here');
        //inside this loop I run through all days between today and flightdate and store each day inside an array called 'arrayDaysBetween' as a DATEOBJECT (important)
        //The loop checks if daycounter is smaller or equal to daysBetween and if so, it runs the code below.
        // until the END OF LOOP COMMENT on line 97
        let getAlldaysBetweenTodayAndFlightDate = new Date(today.getTime() + dayInMilliSeconds * dayCounter);
        arrayDaysBetween.push(getAlldaysBetweenTodayAndFlightDate);
        console.log(arrayDaysBetween);
        //Here i make the calculations of the prices for each day between today and the flightdate
        //First I check if there are more then 2 openseats on the plane (otherwise the price needs to double) and I also check if dayprice is still '0' => if dayprice is '0' it means its the first iteration of the loop and I can't put a -1% discount. It means we want to fly today and since my variable counts from '1' it would deduct 1% with the calculation in the second if-check. I know this is not the greatest explenation but my brain hurts :)
        if (openSeatsOnPlane > 2 && dayPrice == 0) {
          priceWithFirstDiscount = startingPrice; //no discount for days - since its today
          dayPrice = priceWithFirstDiscount - priceWithFirstDiscount * secondDiscount * ticketsSold;
        } else if (openSeatsOnPlane > 2 && dayPrice > 0) {
          priceWithFirstDiscount = startingPrice - startingPrice * firstDiscount * dayCounter; //here we give discount for the days 
          dayPrice = priceWithFirstDiscount - priceWithFirstDiscount * secondDiscount * ticketsSold;
        } else if (openSeatsOnPlane <= 2 && dayPrice == 0) { //same thinking - exept we multiply the price at the end x2 since its one of the last 2 tickets & check if flydate is is not same day as today
          priceWithFirstDiscount = startingPrice;
          dayPrice = (priceWithFirstDiscount - priceWithFirstDiscount * secondDiscount * ticketsSold) * 2;
        } else if (openSeatsOnPlane <= 2 && openSeatsOnPlane > 0) { //same - only flydate is not same day
          priceWithFirstDiscount = startingPrice - startingPrice * firstDiscount * dayCounter;
          dayPrice = (priceWithFirstDiscount - priceWithFirstDiscount * secondDiscount * ticketsSold) * 2;
        } else {
          alert("All tickets have been sold out!"); //if all above are not matched it means the tickets have been sold out. 
        }

        if (dayPrice >= 100) { //if the returned price is less then 100 => set finalPrice to 100 (minimum price)
          finalPriceAfterCheck = dayPrice;
        } else {
          finalPriceAfterCheck = 100;
          dayPrice = 100;
        }

        if (dayCounter == daysBetween) { // here we check if we arrived at the last day between today and flydate. so the returned price is the price for the requested date.
          outputPrice.value = finalPriceAfterCheck + "€"; // output it in the HTML label
        }

        //this if checks which dates are fridays - since i want every friday on the chart.
        //on a Date object we can call the method/function .getDay and it will return a number
        // friday is number 5. monday = 1, tuesday is 2 etc...
        if (getAlldaysBetweenTodayAndFlightDate.getDay() == 5) {
          arrayFridays.push(getAlldaysBetweenTodayAndFlightDate); //push those dates in the friday array
          myChart.data.datasets.forEach(dataset => { 
            dataset.data.push(finalPriceAfterCheck); //this is a parameter of the chart Js object at the bottom of the script which is also and array which holds the data - or in our case - the prices for the charts you want to create. so above we have calculated the final price (line 65-70) which we now store in this array when its a friday.
          });
          myChart.data.datasets.forEach(dataset => { //set a border color for the barcharts
            dataset.borderColor.push('black');
          })
          myChart.data.datasets.forEach(dataset => { //set a background color for the barcharts
            dataset.backgroundColor.push('palegreen');
          })
        }

        dayCounter++;  // increment the dayCounter. If we dont do this => 
                       // since we check "while (dayCounter <= daysBetween)" at the top
                       // The loop would... NEVER END !
      } //END OF LOOP (code keeps running until (daycounter <= daysbetween)

      // push all labels of X-axis into the chart "labels array". element is representing every element in the array "arrayFridays" which are all the friday-dates between today and flightdate. (all of object type Date "new Date")
      arrayFridays.forEach(function (element) { 
        myChart.data.labels.push(element.toISOString().substring(0, 10));
        myChart.update();
      });

      outputSeats.value = openSeatsOnPlane;
      stillSamePerson = true;
    } else {
      alert("Please fill in your name.");
    }
  } else {
    clearInput();
  }
} // end of makeCalculations()

//function which is called when clicking "Book seat button"
function bookSeat() {
  if (openSeatsOnPlane > 0 && outputPrice.value != "") { //check if tickets available AND if the price has been calculated. if its different from "" which means and empty string we output the below.
    alert("Thanks for booking your ticket " + buyerName.value + "!");
    openSeatsOnPlane = openSeatsOnPlane - 1; //adapt available tickets
    ticketsSold = ticketsSold + 1; //and also sold tickets
    inputDate.value = 0; //reset date in html
    buyerName.value = "";//reset buyername in html
    stillSamePerson = false;
    clearInput(); // calls function below to clear all fields
  } else if (outputPrice.value == "") { //else the price was not calculated
    alert("You need to calculate the price first.");
  } else { //and otherwise the tickets are also sold out
    alert("Sorry, all 10 places have been sold.");
  }
}

//function for clearing and resetting all fields
function clearInput() {
  outputSeats.value = openSeatsOnPlane;
  inputDate.value = today.toISOString().substring(0, 10);
  inputDate.min = today.toISOString().substring(0, 10);
  outputPrice.value = "";
  myChart.data.labels = [];
  myChart.data.datasets = [{
    label: "Price for a ticket",
    data: [],
    backgroundColor: [],
    borderColor: [],
    borderWidth: 1
  }];
  arrayDaysBetween = [];
  arrayFridays = [];
  myChart.update();
}

// Implementing Chart.js
let ctx = document.getElementById("myChart");
let myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [{
      label: "Price for a ticket",
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});
