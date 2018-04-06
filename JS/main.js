var config = {
    apiKey: "AIzaSyDbL27B1mbSWKP3SykoikNuSnlPp4Pu62g",
    authDomain: "project-1-9945c.firebaseapp.com",
    databaseURL: "https://project-1-9945c.firebaseio.com",
    projectId: "project-1-9945c",
    storageBucket: "project-1-9945c.appspot.com",
    messagingSenderId: "94214642698"
  };
  firebase.initializeApp(config);

  var trainData = firebase.database();

  $('#add-train-btn').on('click', function(){
      let trainName = $('#train-name-input').val().trim();
      let destination = $('#destination-input').val().trim();
      let firstTrain = $('#first-train-input').val().trim();
      let frequency = $('#frequency-input').val().trim();
// add user input to train object
      let newTrain = {
          name:trainName,
          destination: destination,
          firstTrain: firstTrain,
          frequency:frequency,

      }
      //upload train data to database
      trainData.ref().push(newTrain);

      //clear text boxes
      return false;
  });

  //add data event
  trainData.ref().on('child_added', function(childSnapshot, prevChildKey){
      //store everything into variable
      console.log(childSnapshot.val());
      let tName = childSnapshot.val().name;
      let tDestination = childSnapshot.val().destination;
      let tFrequency = childSnapshot.val().frequency;
      let tFirstTrain = childSnapshot.val().firstTrain;

      let trainArr = tFirstTrain.split(':');
      let trainTime = moment().hours(trainArr[0]).minutes(trainArr[1]);
      let maxMoment = moment.max(moment(), trainTime);
      let tMinutes;
      let tArrival;

      // if first train is later than current time, set arrival to the first train time
        if(maxMoment === trainTime) {
            tArrival = trainTime.format("hh:mm A");
            tMinutes = trainTime.diff(moment(), "minutes");
        }else{
                  //calculate minutes until arrival using math
                  let differenceTimes = moment().diff(trainTime, "minutes");
                  let tRemainder = differenceTimes % tFrequency;
                  tMinutes = tFrequency - tRemainder;
                  //calulate the arrival time
                  tArrival = moment().add(tMinutes, "m").format("mm:hh A");

        }

      // add each train's data into table 
      $('#train-table > tbody').append('<tr><td>' + tName + '</td><td>' + tDestination + '</td><td>' + tFrequency + '</td><td>' + tArrival + '</td><td>' + tMinutes + '</td><tr');
  });