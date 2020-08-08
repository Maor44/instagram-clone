import React from 'react';
import './Post.scss';

import Avatar from '@material-ui/core/Avatar';

const Post = ({ username, imageUrl, caption }) => {
  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar className='post__avatar' alt={username.charAt(0).toUpperCase()} src='/static/images/avatar/1.jpg' />
        <h3>{username}</h3>
      </div>

      <img src={imageUrl} alt='' className='post__image' />

      <h4 className='post__text'>
        <strong>{username}:&nbsp;</strong>  {caption}
      </h4>
    </div>
  );
};

export default Post;
