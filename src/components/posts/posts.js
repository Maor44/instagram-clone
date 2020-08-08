import React from 'react';
import './posts.scss';
import Post from "../post/Post";

function Posts({posts}) {
    return (
        <div className="posts">
            {posts.length > 0 ? posts.map(({id, post}) => {
                return (
                    <Post
                        key={id}
                        username={post.username}
                        caption={post.caption}
                        imageUrl={post.imageUrl}
                    />
                );
            }) : <h1>no posts</h1>}
        </div>
    );
}

export default Posts;