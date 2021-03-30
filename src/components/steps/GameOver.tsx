import React from 'react';
import * as MUI from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import _ from 'lodash';

interface GameOverProps {
  onNextStepPerceivedList: (description: string) => void
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
    color: '#686868',
    textAlign: 'center'
  },
  descriptions: {
    marginTop: '24px',
    marginBottom: '24px',
    maxHeight: '500px',
    overflow: 'auto',
    overflowX: 'hidden',
    "& > div": {
      display: 'flex',
      "& > div": {
        display: 'flex',
        alignItems: 'center'
      }  
    }
  },
  input: {
    width: '150px',
    borderBottom: `1px solid #212121`
  },
  button: {
    width: '200px',
    marginTop: '24px',
    marginBottom: '32px',
    border: `1px solid #bebebe`
  },
  addButton: {
    marginTop: '24px',
    width: '200px'
  }
}));

const GameOver = (props: GameOverProps) => {
  const [descriptions, setDescriptions] = React.useState(["", "", "", "", "", "", "", ""]);
  const classes = useStyles();

  const handleUpdateDescription = (index: number, value: string) => {
    const clone = _.clone(descriptions);
    _.set(clone, `[${index}]`, value);
    setDescriptions(clone);
  }

  const handleClickSubmit = () => {
    const filtered = _.filter(descriptions, description => !_.isEmpty(description));
    if(_.isEmpty(filtered)) return false;

    props.onNextStepPerceivedList(JSON.stringify(filtered));
  }

  return (
    <MUI.Dialog open={true}>
      <MUI.Box className={classes.container}>
        <MUI.Box className={classes.instruction}>
          GAME OVER<br /><br />
          방금 한 스스로의 행위들을<br />
          인지한 "순서대로" 최대한 자세히 적어주세요
        </MUI.Box>
        <MUI.Box className={classes.descriptions}>
          {_.map(descriptions, (description: string, index: number) => (
            <MUI.Box key={index}>
              <MUI.Box mr="16px">{index + 1}. </MUI.Box>
              <MUI.Box>
                <MUI.InputBase
                  className={classes.input}
                  value={description}
                  onChange={(evt) => handleUpdateDescription(index, evt.target.value)}
                />
              </MUI.Box>
            </MUI.Box>
          ))}
          <MUI.Button
            className={classes.addButton}
            onClick={() => setDescriptions(_.concat(descriptions, [""]))}
          >
            +
          </MUI.Button>  
        </MUI.Box>
        <MUI.Button 
          className={classes.button}
          onClick={handleClickSubmit}
        >
          아티스트에게 보내기
        </MUI.Button>
      </MUI.Box>
    </MUI.Dialog>
  )
}

export default GameOver;