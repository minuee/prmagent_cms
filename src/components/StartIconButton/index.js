import { Button } from '@material-ui/core';
import React from 'react';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import NoteAddOutlinedIcon from '@material-ui/icons/NoteAddOutlined';

export default function StartIconButton({
  category = 'edit',
  onClick = () => {},
}) {
  let getCategroyIcon = () => {
    if (category == 'edit') {
      return <EditOutlinedIcon />;
    } else if (category == 'excel') {
      return <ListAltOutlinedIcon />;
    } else if (category == 'write') {
      return <NoteAddOutlinedIcon />;
    } else {
      return <EditOutlinedIcon />;
    }
  };
  let getCategoryLabel = () => {
    if (category == 'edit') {
      return '수정';
    } else if (category == 'excel') {
      return '엑셀저장';
    } else if (category == 'write') {
      return '작성';
    } else {
      return '수정';
    }
  };

  return (
    <Button variant="outlined" onClick={onClick} startIcon={getCategroyIcon()}>
      {getCategoryLabel()}
    </Button>
  );
}
