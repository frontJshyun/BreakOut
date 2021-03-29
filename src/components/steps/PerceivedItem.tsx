import React from 'react';
import * as MUI from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import _ from 'lodash';
import PerceivedService from '../../services/PerceivedService';
import { Perceived } from '../../models/models';
import transitions from '@material-ui/core/styles/transitions';

interface PerceivedItemProps {
  id: string,
  userName: string,
  description: string,
  deletePerceived: (id: string) => void,
} 

const useStyles = makeStyles(() => ({
  item: {
    width: '144px',
    height: '200px',
    padding: '16px',
    boxShadow: 'rgb(50 50 93 / 3%) 0px 2px 5px -1px, rgb(0 0 0 / 5%) 0px 1px 3px -1px',
    borderRadius: '6px',
    margin: '8px',
    transition: '0.3s',
    backgroundColor: '#eee',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      backgroundColor: '#ccc'
    }

  },
}));

const PerceivedItem = (props: PerceivedItemProps) => {
  const classes = useStyles();

  const { id, userName, description } = props;

  return (
    <MUI.Box className={classes.item} onDoubleClick={() => props.deletePerceived(id)}>
      <MUI.Box fontSize="16px" color="#616161">
        {userName}
      </MUI.Box>

      <MUI.Box mt="24px" overflow="auto" style={{ overflowX: 'hidden' }}>
        {_.map(JSON.parse(description), (description, index) => (
          <MUI.Box key={index} fontSize="12px" color="#424242" display="flex">
            <MUI.Box width="15px">{index + 1}</MUI.Box>
            <MUI.Box>{description}</MUI.Box>
          </MUI.Box>
        ))}  
      </MUI.Box>

    </MUI.Box>
  )
}

export default PerceivedItem;