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
import {createMuiTheme, Typography} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";

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

const theme = createMuiTheme({
    typography: {
        fontFamily: [
            'Noto Sans',
            'sans-serif'
        ].join(','),
    }
});

const App = () => {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [signInOpen, setSignInOpen] = useState(false);
    const [values, setValues] = useState({email: '', password: '', username: ''});
    const [errors, setErrors] = useState(null)
    const [user, setUser] = useState(null)

    const signUpFormHandle = (e) => {
        const {value, name} = e.target;

        const updatedValues = {...values, [name]: value}

        setValues(updatedValues)
    }

    const signupFormSubmitHandle = async (e) => {
        e.preventDefault()

        setErrors({})

        if(values.username.trim().length === 0) {
            setErrors(prevState => ({...prevState, username: 'This is mandatory'}) )
        }
        if(values.email.trim().length === 0) {
            setErrors(prevState => ({...prevState, email: 'This is mandatory'}) )
        }
        if(values.password.trim().length === 0) {
            return setErrors(prevState => ({...prevState, password: 'This is mandatory'}) )
        }

        try {
            const res = await auth.createUserWithEmailAndPassword(values.email, values.password)
            await res.user.updateProfile({displayName: values.username})
            setOpen(false);
            setValues(null)
        } catch (e) {
            if(e.code === 'auth/invalid-email' || e.code === 'auth/email-already-in-use') {
                setErrors(prevState => ({...prevState, email: e.message}) )
            }

            if(e.code === 'auth/weak-password') {
                setErrors(prevState => ({...prevState, password: e.message}) )
            }
        }
    }

    const signInFormSubmitHandle = async (e) => {
        e.preventDefault();
        setErrors({})

        if(values.email.trim().length === 0) {
            setErrors(prevState => ({...prevState, email: 'This is mandatory'}) )
        }
        if(values.password.trim().length === 0) {
            return setErrors(prevState => ({...prevState, password: 'This is mandatory'}) )
        }

        try {
            await auth.signInWithEmailAndPassword(values.email, values.password);
            setSignInOpen(false);
            setValues(null)
        } catch (e) {
            console.log(e);
            if(e.code === 'auth/invalid-email') {
                setErrors(prevState => ({...prevState, email: e.message}) )
            }

            if(e.code === 'auth/wrong-password') {
                setErrors(prevState => ({...prevState, general: 'Wrong Credentials'}) )
            }

            if(e.code === 'auth/too-many-requests') {
                setErrors(prevState => ({...prevState, general: e.message}) )
            }

            console.log(errors);
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
        <ThemeProvider theme={theme}>
            <div className='app'>

                <Header user={user} setSignInOpen={setSignInOpen} setOpen={setOpen}/>

                <Posts posts={posts} signinUser={user}/>

                <UploadPost username={user?.displayName}/>

                <Modal
                    open={open}
                    onClose={() => {
                        setOpen(false);
                        setErrors(null)
                    }}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div style={modalStyle} className={classes.paper}>
                        <div style={{textAlign: 'center'}}>
                            <img
                                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                                alt='Instagram' className='header__image'/>
                        </div>
                        <TextField onChange={(e) => signUpFormHandle(e)} fullWidth={true} name={"username"}
                                   label="Username" error={errors?.username?.length > 0} helperText={errors?.username}/>
                        <TextField onChange={(e) => signUpFormHandle(e)} type="email" fullWidth={true} name={"email"}
                                   label="Email" error={errors?.email?.length > 0} helperText={errors?.email}/>
                        <TextField onChange={(e) => signUpFormHandle(e)} fullWidth={true} name={"password"}
                                   label="Password" type={"password"} error={errors?.password?.length > 0} helperText={errors?.password}/>

                        <Button onClick={signupFormSubmitHandle} style={{marginTop: '1rem'}} variant="contained"
                                color="primary" type="submit">Sign up</Button>

                    </div>
                </Modal>

                <Modal
                    open={signInOpen}
                    onClose={() => {
                        setSignInOpen(false);
                        setErrors(null)
                    }}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div style={modalStyle} className={classes.paper}>
                        <div style={{textAlign: 'center'}}>
                            <img
                                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                                alt='Instagram' className='header__image'/>
                        </div>
                        <TextField
                            onChange={(e) => signUpFormHandle(e)} type="email" fullWidth={true} name={"email"}
                            label="Email" error={errors?.email?.length > 0} helperText={errors?.email}/>

                        <TextField onChange={(e) => signUpFormHandle(e)} fullWidth={true} name={"password"}
                                   type="password" label="Password" error={errors?.password?.length > 0} helperText={errors?.password}/>

                        <Typography variant="body2" color={"error"}>{errors?.general}</Typography>

                        <Button onClick={signInFormSubmitHandle} style={{marginTop: '1rem'}} variant="contained"
                                color="primary" type="submit">Sign in</Button>

                    </div>
                </Modal>
            </div>
        </ThemeProvider>
    );
};

export default App;
