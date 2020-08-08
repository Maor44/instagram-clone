import React from 'react';
import './Header.scss';
import Button from "@material-ui/core/Button";
import {auth} from "../../firebase/firebase";

const Header = ({user, setSignInOpen, setOpen}) => {
  return (
    <header className='header'>
      <img src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' alt='Instagram' className='header__image' />

        <div className="header__menu">
            {user
                ?
                <Button onClick={() => auth.signOut()}>signout</Button>
                :
                <>
                    <Button onClick={() => setSignInOpen(true)}>Sign In</Button>
                    <Button onClick={() => setOpen(true)}>Sign Up</Button>
                </>
            }
        </div>
      
    </header>
  );
};

export default Header;
