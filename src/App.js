import React from 'react';
import './App.scss';

import Header from './components/Header/Header';
import Post from './components/Post/Post';

const App = () => {
  return (
    <div className='app'>
      <Header />

      <Post username={'maor33'} imageUrl={'https://reactjs.org/logo-og.png'} caption={'React is cool'} />
      <Post username={'lior22'} imageUrl={'https://miro.medium.com/max/4000/1*WNPicrz6DJegizpj4VY58Q.jpeg'} caption={'vue is cool'} />
      <Post username={'ron11'} imageUrl={'https://www.freecodecamp.org/news/content/images/2020/04/Copy-of-Copy-of-Travel-Photography.png'} caption={'angular is sucks'} />
    </div>
  );
};

export default App;
