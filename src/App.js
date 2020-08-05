import React, { useState, useEffect } from 'react';
import './App.scss';

import Header from './components/Header/Header';
import Post from './components/Post/Post';

import { db } from './firebase/firebase';
import { Dialog, Button } from '@material-ui/core';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    db.collection('posts').onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => {
          return { id: doc.id, post: doc.data() };
        })
      );
    });
  }, []);

  return (
    <div className='app'>
      <Dialog open={open} setOpen={setOpen} />
      <Header />

      {posts.map(({ id, post }) => {
        return (
          <Post
            key={id}
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
          />
        );
      })}
    </div>
  );
};

export default App;
