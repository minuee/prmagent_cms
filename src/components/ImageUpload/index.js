import { Box, Button, Grid, IconButton } from '@material-ui/core';
import React from 'react';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import { useDropzone } from 'react-dropzone';

export default function ImageUpload({ files, setFiles }) {
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });
  return (
    <Grid container justify="space-between" alignItems="center">
      <Grid item style={{ display: 'flex', alignItems: 'center' }}>
        <Box display="flex" {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <ImageOutlinedIcon style={{ marginRight: '5px' }} />
          {files.length > 0
            ? acceptedFiles.map((file) => (
                <span key={file.path}>
                  {file.path} - ({file.size / 1000}KB)
                </span>
              ))
            : '파일 없음'}
        </Box>
        <IconButton
          aria-label="clear"
          onClick={() => {
            setFiles([]);
          }}
        >
          <ClearOutlinedIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          disableElevation={true}
          size="small"
          onClick={open}
        >
          파일업로드
        </Button>
      </Grid>
    </Grid>
  );
}
