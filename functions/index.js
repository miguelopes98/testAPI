const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const {parse, stringify} = require('flatted');
const cors = require('cors')({origin: true});
const app = express();
app.use(cors);
admin.initializeApp(functions.config().firebase);

app.get('/fibonacciNumber', (request, response) => {

  if(request.query.number){
    let number = request.query.number;
    //fibonacci calculations
    let sequence= [0,1];
    while(sequence.length <= number) {
      let nextNumber = sequence[sequence.length - 1] + sequence[sequence.length - 2];
      sequence.push(nextNumber);
    }

    const goodRequest = stringify(request);

    //adding the request to firestore
    admin.firestore().collection('requests').add({request: goodRequest});
    //sending response back
    response.send({request: goodRequest, number: sequence[number]});
  }
  else{
    //sending response back
    response.send({request: goodRequest, number: undefined});
  }
  
  
});

exports.app = functions.https.onRequest(app);