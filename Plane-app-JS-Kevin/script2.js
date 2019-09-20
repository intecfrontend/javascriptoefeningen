class FlightTicket {
    constructor(bookDate, flightDate, namePassenger){
      this.bookDate = bookDate ;
      this.flightDate = flightDate;
      this.namePassenger = namePassenger;
      this.priceOfTicket = 0;
      this.basePrice = 1000;
      this.differenceInDays = checkDaysBetweenTodayAndFlyDate();
    }

    getBookDate() {
      return this.bookDate;
    }
    getFlightDate() {
      return this.flightDate;
    }
    getNameOfPassenger() {
      return this.namePassenger;
    }
    getPriceOfTicket() {
      return this.priceOfTicket;
    }
    printTicket() {
      console.log('Please find herwith your ticket for your flight');
      console.log(`Passenger name: ${this.namePassenger} - Price paid for ticket: ${this.priceOfTicket}€`);
      console.log(`Date of Booking: ${this.bookDate} - Date of flight ${this.flightDate}`);
    }

    checkDaysBetweenTodayAndFlyDate() {
      let flyDate = document.querySelector("#input-date").valueAsDate;
      var timeDiff = Math.abs(flyDate.getTime() - today.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return diffDays;
    }

}

let ticket1 = new FlightTicket("2019-08-2019","2019-08-30","Kevin Govaerts",500);
let ticket2 = new FlightTicket("2019-08-27","2019-09-30","Thierry",500);


function checkDaysBetweenTodayAndFlyDate() {
    let flyDate = document.querySelector("#input-date").valueAsDate;
    var timeDiff = Math.abs(flyDate.getTime() - today.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }

function calculatePrice() {
  let ticketPrice = 0;



}

var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Price for a ticket",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }
    ]
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }
});