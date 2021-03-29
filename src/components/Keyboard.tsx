import React from 'react';
import _ from 'lodash';
import * as MUI from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface KeyboardProps {
  isLeft: boolean,
  isRight: boolean,
} 

const useStyles = makeStyles(() => ({
  container: {
    width: '200px',
    height: '100px',
    position: 'absolute',
    bottom: 50,
    right: 20,
    '& > div': {
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    }
  }
}));

const Keyboard = (props: KeyboardProps) => {
  const classes = useStyles();
  const { isLeft, isRight } = props;

  return (
    <MUI.Box className={classes.container} data-before={'W'}>
      <MUI.Box>
        <button className="kbc-button">↑</button>
      </MUI.Box>
      <MUI.Box>
        <button className={isLeft ? "kbc-button active" : "kbc-button"}>←</button>
        <button className="kbc-button">↓</button>
        <button className={isRight ? "kbc-button active" : "kbc-button"}>→</button>
      </MUI.Box>
    </MUI.Box>
  )
}

export default Keyboard;