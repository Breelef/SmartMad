
import './App.css';
import Button from './components/button.js'; 
import Footer from './components/footer.js';
import image from './image.png';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={image} className="App-logo" alt="logo" />
        <Button></Button>
      </header>
      <Footer></Footer>
    </div>
  );
}

export default App;


/*
import React from 'react';
import Button from './components/Button'; 

function App() {
  return (
    <div className="App">
      <h1>My React App</h1>
      <Button /> {Use the Button component here}
      </div>
    );
  }
  
  export default App;
  

*/