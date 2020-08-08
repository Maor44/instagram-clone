import React, {useState} from 'react';
import './upload-post.scss';

import {Button, TextField} from "@material-ui/core";

import {db, storage} from "../../firebase/firebase";
import {firestore} from "firebase";

function UploadPost({username}) {
    const [progress, setProgress] = useState(20);
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);

    const uploadImageHandle = (e) => {
        setImage(e.target.files[0])
    }

    const uploadPostHandle = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on('state_changed', (snapshot) => {
            const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100

            setProgress(progress)
        }, (error) => {
            console.log(error);
        }, () => {
            storage.ref('images').child(image.name).getDownloadURL().then(imageUrl => {
                db.collection('posts').add({
                    timestamp: firestore.FieldValue.serverTimestamp(),
                    caption,
                    imageUrl,
                    username
                })

                setImage(null);
                setProgress(0);
                setCaption("")
            })
        })
    }

    if(!username) return <div className={'upload-post'}><h3>Please sign in for uploading posts</h3></div>
    return (
        <div className="upload-post">
            {progress > 0 && <div className="upload-post__progress" style={{width: `${progress}%`}}/>}
            <div className="upload-post__container">
                <TextField className="upload-post__input upload-post__file" onChange={uploadImageHandle} type="file"/>
                <TextField className="upload-post__input upload-post__caption" value={caption} type="text"
                           onChange={(e) => setCaption(e.target.value)} label={'Caption'}/>
                <Button variant={"contained"} onClick={uploadPostHandle} color={"primary"}>Upload Post</Button>
            </div>
        </div>
    );
}

export default UploadPost;