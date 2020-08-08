import React, {useEffect, useState} from 'react';
import './App.scss';

import Header from './components/header/Header';

import {auth, db} from './firebase/firebase';
import Modal from "@material-ui/core/Modal";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import UploadPost from "./components/upload-post/upload-post";
import Posts from "./components/posts/posts";

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const App = () => {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [signInOpen, setSignInOpen] = useState(false);
    const [values, setValues] = useState({});
    const [user, setUser] = useState(null)

    const signUpFormHandle = (e) => {
        const {value, name} = e.target;

        const updatedValues = {...values, [name]: value}

        setValues(updatedValues)
    }

    const signupFormSubmitHandle = async (e) => {
        e.preventDefault()
        try {
            const res = await auth.createUserWithEmailAndPassword(values.email, values.password)
            await res.user.updateProfile({displayName: values.username})
            setOpen(false);
            setValues({})
        } catch (e) {
            alert(e)
        }
    }

    const signInFormSubmitHandle = async (e) => {
        e.preventDefault();

        try {
            await auth.signInWithEmailAndPassword(values.email, values.password);
            setSignInOpen(false);
            setValues({})
        } catch (e) {
            alert(e)
        }
    }

    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
            setPosts(
                snapshot.docs.map((doc) => {
                    return {id: doc.id, post: doc.data()};
                })
            );
        });
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                setUser(authUser)
            } else {
                setUser(null)
            }
        })

        return () => {
            unsubscribe();
        }
    }, [user])

    return (
        <div className='app'>

            <Header user={user} setSignInOpen={setSignInOpen} setOpen={setOpen}/>

            <Posts posts={posts} />

            <UploadPost username={user?.displayName} />

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <div style={{textAlign: 'center'}}>
                        <img src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                             alt='Instagram' className='header__image'/>
                    </div>
                    <TextField onChange={(e) => signUpFormHandle(e)} fullWidth={true} name={"username"}
                               label="Username"/>
                    <TextField onChange={(e) => signUpFormHandle(e)} type="email" fullWidth={true} name={"email"}
                               label="Email"/>
                    <TextField onChange={(e) => signUpFormHandle(e)} fullWidth={true} name={"password"}
                               label="Password"/>

                    <Button onClick={signupFormSubmitHandle} style={{marginTop: '1rem'}} variant="contained"
                            color="primary" type="submit">Sign up</Button>
                </div>
            </Modal>

            <Modal
                open={signInOpen}
                onClose={() => setSignInOpen(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <div style={{textAlign: 'center'}}>
                        <img src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                             alt='Instagram' className='header__image'/>
                    </div>
                    <TextField onChange={(e) => signUpFormHandle(e)} type="email" fullWidth={true} name={"email"}
                               label="Email"/>
                    <TextField onChange={(e) => signUpFormHandle(e)} fullWidth={true} name={"password"}
                               type="password" label="Password"/>

                    <Button onClick={signInFormSubmitHandle} style={{marginTop: '1rem'}} variant="contained"
                            color="primary" type="submit">Sign in</Button>
                </div>
            </Modal>
        </div>
    );
};

export default App;
