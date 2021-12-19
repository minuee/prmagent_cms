import React, { useState } from 'react';
import {
  Collapse,
  List,
  ListItem,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { useHistory, useLocation } from 'react-router-dom';
import { SidebarList } from './LayoutConsts';

const useStyles = makeStyles((theme) => ({
  ListItemTextRoot: {
    fontWeight: 'normal',
  },
  topLevelIndentation: {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(3.5),
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),
    borderBottom: '2px solid #222',
  },
  collapseContainer: {
    // backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.common.black,
  },

  selectedTopLevel: {
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
    },
  },

  subListItemRoot: {
    paddingLeft: theme.spacing(5),
    paddingTop: theme.spacing(1.25),
    paddingBottom: theme.spacing(1.25),
  },
  selectedSubListItem: {
    color: theme.palette.common.white,
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  selectedText: {
    fontWeight: 500,
  },
  notSelectedText: {
    fontWeight: 300,
    color: theme.palette.common.white,
  },
}));

export default function SidebarNavigation() {
  const classes = useStyles();

  const [openState, setOpenState] = useState(
    SidebarList.map((d, idx) => (idx == 0 ? true : false))
  );

  let location = useLocation();

  const history = useHistory();

  const handleExpansionClick = (idx, target) => {
    const newOpenState = [...openState];
    newOpenState[idx] = !newOpenState[idx];
    setOpenState(newOpenState);
    if (target.subList.length == 0) {
      history.push(target.link);
    }
  };

  const handleSubMenuClick = (target) => {
    history.push(target.link);
  };

  return (
    <List aria-labelledby="sidebar-navigation" disablePadding>
      {SidebarList.map((item, idx) => (
        <div key={item.link}>
          <ListItem
            button
            onClick={() => handleExpansionClick(idx, item)}
            to={item.link}
            selected={location.pathname.startsWith(item.link)}
            className={classes.topLevelIndentation}
            classes={{
              selected: classes.selectedTopLevel,
            }}
          >
            <ListItemText
              primary={item.displayValue}
              primaryTypographyProps={{ variant: 'h6' }}
              classes={{
                primary: location.pathname.startsWith(item.link)
                  ? ''
                  : classes.ListItemTextRoot,
              }}
            />
            {item.subList.length > 0 && (
              <>{openState[idx] ? <ExpandLess /> : <ExpandMore />}</>
            )}
          </ListItem>
          {item.subList.length > 0 && (
            <Collapse
              in={openState[idx]}
              timeout="auto"
              unmountOnExit
              classes={{ container: classes.collapseContainer }}
            >
              <List component="div" disablePadding>
                {item.subList.map((subItem) => (
                  <ListItem
                    button
                    key={subItem.link}
                    to={subItem.link}
                    onClick={() => handleSubMenuClick(subItem)}
                    selected={location.pathname.startsWith(subItem.link)}
                    classes={{
                      root: classes.subListItemRoot,
                      selected: classes.selectedSubListItem,
                    }}
                  >
                    <ListItemText
                      primary={subItem.displayValue}
                      primaryTypographyProps={{ variant: 'h6' }}
                      classes={{
                        primary: location.pathname.startsWith(subItem.link)
                          ? classes.selectedText
                          : classes.notSelectedText,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          )}
        </div>
      ))}
    </List>
  );
}
