$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyACXgyrF1qyHSM0CQ14BRQSG-uSev3GmOI",
        authDomain: "traintrack-0712.firebaseapp.com",
        databaseURL: "https://traintrack-0712.firebaseio.com",
        storageBucket: "traintrack-0712.appspot.com",
    };
    firebase.initializeApp(config);

    var database = firebase.database();


    function nextArrivalTime(userTime, freq) {

        if (userTime.isBefore(moment())) {
            while (userTime.diff(moment(), 'minutes') < freq) {
                userTime.add(freq, 'm');
            }
            userTime.subtract(freq, 'm');

        } else if (userTime.isAfter(moment())) {
            while (userTime.diff(moment(), 'minutes') > freq) {
                userTime.subtract(freq, 'm');
            }
        }
        return userTime;
    }



    $(document.body).on('click', '#add-all-values', function () {
        event.preventDefault();

        let firstTrain = moment($('#first-train-time-input').val().trim(), 'HH:mm');
        let freqNum = parseInt($('#frequency-input').val().trim());
        let nextArrival = nextArrivalTime(firstTrain, freqNum);

        let difference = nextArrival.diff(moment(), 'minutes') + 1;


        let newTrainData = {
            trainKey: $('#train-name-input').val().trim(),
            destKey: $('#destination-input').val().trim(),
            freqKey: $('#frequency-input').val().trim(),
            nextArrivalKey: nextArrival.format('hh:mm a'),
            minutesAwayKey: difference,
        };

        database.ref().push(newTrainData);

    });



    database.ref().on("child_added", function (childSnapshot) {

        let trainValName = childSnapshot.val().trainKey;
        let trainDestName = childSnapshot.val().destKey;
        let trainFreqName = childSnapshot.val().freqKey;
        let trainNextName = childSnapshot.val().nextArrivalKey;
        let trainMinName = childSnapshot.val().minutesAwayKey;

        let newRow = $("<tr>").append(
            $("<td>").text(trainValName),
            $("<td>").text(trainDestName),
            $("<td>").text(trainFreqName),
            $("<td>").text(trainNextName),
            $("<td>").text(trainMinName),
        )

        $('table').append(newRow);

        $(newRow).append($('<button>').text('refresh'));

    });

});