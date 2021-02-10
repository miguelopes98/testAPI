import React, {useEffect, useState} from 'react';
import axios from './axios-instance';
import './App.css';
import firebase from './firebase';

const App = () => {

  const [requestsMade, setRequestsMade] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(0);
  const [submittedValue, setSubmittedValue] = useState(null);
  const [fibonacciResult, setFibonacciResult] = useState(null);


  const requests = firebase.firestore().collection("requests");

  useEffect(() => {
    getRequests();
  }, [])

  const getRequests = () => {
    setLoading(true);
    requests.onSnapshot((querySnapShot) => {
      const items = [];
      querySnapShot.forEach((doc) => {
        items.push(doc.data());
      });
      setRequestsMade(items);
      setLoading(false);
    });
  }

  const onChangeHandler = (event) => {
    setInputValue(event.target.value);
  }

  const submitHandler = (event) => {
    event.preventDefault();
    setSubmittedValue(inputValue);
    //window.location.assign("https://us-central1-testapi-6bce3.cloudfunctions.net/helloWorld/?number=" + inputValue);
    axios.get(window.location.href + "fibonacciNumber?number=" + inputValue)
      .then(response => {
        //save the fibonacci result in state
        setFibonacciResult(response.data.number);
      })
      .catch(err=> {
        console.log(err);
      })

    //reset the input value
    setInputValue(0);

  }

  if(loading) {
    return <h1>Loading...</h1>
  }

  let fibonacciResultText = null;

  if(fibonacciResult!==null){
    let suffix = 'th';

    //if we try .toString() when submittedValue is zero, we get an error saying it cannot use .toString a null value
    if(fibonacciResult > 0){
      let valueText = submittedValue.toString();
      let lastChar = valueText.charAt(valueText.length - 1);

      let secondToLastChar = null;
      if(valueText.length > 1) {
        secondToLastChar = valueText.charAt(valueText.length - 2);
      }

      if(lastChar === '1'){
        suffix = 'st';
        if(secondToLastChar === '1') {
          suffix = 'th';
        }
      }
        
      if(lastChar === '2'){
        suffix = 'nd';
        if(secondToLastChar === '1') {
          suffix = 'th';
        }
      }

      if(lastChar === '3'){
        suffix = 'rd';
        if(secondToLastChar === '1') {
          suffix = 'th';
        }
      }
    }
      
    fibonacciResultText = <p>The {submittedValue}{suffix} number in the Fibonacci sequence is: {fibonacciResult} </p>
  }

  return (
    <div className="App">
      <h2>What is the n-th number in the Fibonacci sequence you would like to get?</h2>
      <p>Note that the last n-th number possible is 1476, from there onward, JavaScript cannot process the result.</p>
      <form onSubmit={submitHandler}>
        <input type="number" min="0" max='1476' value={inputValue} onChange={(event) => onChangeHandler(event)}/>
        <button>Submit</button>
      </form>
      {fibonacciResultText}
      <h3>Requests Made:</h3>
      {requestsMade.map((requestMade, index) => {
        return (
          <div key={index} className="request">
            <h3>Request {index}</h3>
            <p>{requestMade.request}</p>
          </div>
        )
      })}
    </div>
  );
}

export default App;
