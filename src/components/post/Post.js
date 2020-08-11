import React, {useEffect, useState} from 'react';
import './Post.scss';

import Avatar from '@material-ui/core/Avatar';
import {db} from "../../firebase/firebase";
import Button from "@material-ui/core/Button";
import * as firebase from "firebase";

const Post = ({postId, signinUser, username, imageUrl, caption}) => {
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState([])

    useEffect(() => {

        const unsubscribe = db.collection('posts').doc(postId).collection('comments').orderBy('timestamp', 'desc').onSnapshot((snapshot => {
            setComments(snapshot.docs.map((doc => {
                return {id: doc.id, ...doc.data()}
            })))
        }))

        return () => {
            unsubscribe()
        }

    }, [postId])

    const handlePostComment = async (e) => {
        e.preventDefault();

        await db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: signinUser.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        setComment("")
    }

    return (
        <div className='post'>
            <div className='post__header'>
                <Avatar className='post__avatar' alt={username.charAt(0).toUpperCase()}
                        src='/static/images/avatar/1.jpg'/>
                <h3>{username}</h3>
            </div>

            <img src={imageUrl} alt='' className='post__image'/>

            <h4 className='post__text'>
                <strong>{username}:&nbsp;</strong> {caption}
            </h4>

            <div className="post__comments">
                <div className="post__comments__list">
                    {comments.map(({username, text, id}) => {
                        return (
                            <p key={id} className="post__comments__text"><strong>{username}</strong> {text}</p>
                        )
                    })}
                </div>
                {signinUser && <div className="post__comments__form">
                    <input className="post__comments__form__input" value={comment}
                           onChange={(e) => setComment(e.target.value)} placeholder={'Add new comment...'}/>
                    <Button disabled={!comment} onClick={handlePostComment} color={"primary"} size={"large"}
                            className="post__comments__form-button">Post</Button>
                </div>}
            </div>
        </div>
    );
};

export default Post;
