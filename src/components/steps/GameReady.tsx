import React from 'react';
import * as MUI from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import _ from 'lodash';

interface GameReadyProps {
  onNextStepGameStart: () => void
} 

const useStyles = makeStyles(() => ({
  container: {
    width: '600px',
    minHeight: '240px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  instruction: {
    marginTop: '32px',
    color: '#686868'
  },
  input: {
    width: '150px',
    marginTop: '36px',
    borderBottom: `1px solid #212121`
  },
  button: {
    width: '200px',
    marginTop: '106px',
    border: `1px solid #bebebe`
  }
}));

const GameReady = (props: GameReadyProps) => {
  const classes = useStyles();

  return (
    <MUI.Dialog open={true}>
      <MUI.Box className={classes.container}>
        <MUI.Box className={classes.instruction}>
          당신의 행동에 "충분히" 주목하세요.
        </MUI.Box>
        <MUI.Button 
          className={classes.button}
          onClick={() => props.onNextStepGameStart()}
        >
          시작하기
        </MUI.Button>
        {/* <MUI.InputBase
          className={classes.input}
          placeholder={"이름"}
          value={userName}
          onChange={(evt) => setUserName(evt.target.value)}
        />
        <MUI.Box mt="24px" mb="16px" textAlign="center" fontSize="14px" color="#484848">
          당신의 이름을 적어주세요
        </MUI.Box>
        <MUI.Button 
          className={classes.button}
          onClick={handleGameStart}
        >
          다음
        </MUI.Button> */}
      </MUI.Box>
    </MUI.Dialog>
  )
}

export default GameReady;