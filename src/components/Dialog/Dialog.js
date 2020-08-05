import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal } from '@material-ui/core';

const Dialog = (props) => {
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

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <button type='button' onClick={() => setOpen(true)}>
        Open Modal
      </button>
      <Modal open={open} onClose={setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <h2>this is modal</h2>
        </div>
      </Modal>
    </div>
  );
};

export default Dialog;
