import React from 'react';
import * as MUI from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import _ from 'lodash';
import PerceivedService from '../../services/PerceivedService';
import { Perceived } from '../../models/models';
import PerceivedItem from './PerceivedItem';

interface PerceivedListProps {
  onNextStepInit: () => void
} 

const useStyles = makeStyles(() => ({
  container: {
    '& .MuiDialog-paperWidthSm': {
      maxWidth: '1024px'
    }
  },
  button: {
    border: '1px solid #aaa'
  },
}));

const PerceivedList = (props: PerceivedListProps) => {
  const classes = useStyles();
  const [list, setList] = React.useState([]);

  React.useEffect(() => {
    getPerceived();
  }, [])

  const getPerceived = () => {
    PerceivedService.getPerceived()
      .then((res: any) => {
        const { status, data } = res;
        if(status === 200) {
          setList(data)
        }
      })
  }

  const deletePerceived = (id: string) => {
    const prompt = window.prompt("비밀번호");
    if(prompt == "2030") {
      PerceivedService.deletePerceived({ id })
        .then(() => {
          getPerceived();
        })
    }    
  }

  return (
    <MUI.Dialog className={classes.container} open={true}>
      <MUI.Box width="960px" padding="32px" display="flex" flexDirection="column">
        <MUI.Box width="100%" maxHeight="600px" overflow="auto" mb="24px" display="flex" flexWrap="wrap" style={{ overflowX: 'hidden'}}>
          {_.map(list, (perceived: Perceived, index: number) => (
            <PerceivedItem id={perceived.id} userName={perceived.userName} description={perceived.description} deletePerceived={deletePerceived}/>
          ))}
        </MUI.Box>

        <MUI.Button 
          className={classes.button}
          onClick={props.onNextStepInit}
        >
          다시 인지 해보기
        </MUI.Button>
      </MUI.Box>
    </MUI.Dialog>
  )
}

export default PerceivedList;