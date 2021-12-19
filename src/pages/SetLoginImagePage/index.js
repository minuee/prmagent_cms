import React, { useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress, makeStyles } from '@material-ui/core';
import KeyValueTable from 'components/KeyValueTable';
import PageSubtitle from 'components/PageSubtitle';
import SaveButtonSection from 'components/SaveButtonSection';
import StartIconButton from 'components/StartIconButton';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { apiObject } from 'api';
import ImageUpload from 'components/ImageUpload';
import { Fragment } from 'react';

const useStyles = makeStyles(() => ({
  previewImage: { maxHeight: '40vh', maxWidth: '100%' },
}));

export default function SetLoginImagePage() {
  const classes = useStyles();
  const queryClient = useQueryClient();

  const [files, setFiles] = useState([]);

  const loginImageQuery = useQuery(
    ['login-image'],
    async () => await apiObject.getLoginImage(() => {}),
    {}
  );
  const uploadImage = useMutation(
    (file) => apiObject.setLoginImage({ file }, () => {}),
    {
      onSuccess: () => {},
      onSettled: () => {
        queryClient.invalidateQueries(['login-image']);
      },
    }
  );

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const dataSource = useMemo(
    () => [
      {
        keyText: '기존 이미지',
        valText: () => (
          <img
            src={
              loginImageQuery.isLoading ? '' : loginImageQuery.data.img_full_url
            }
            className={classes.previewImage}
          />
        ),
        isHalf: false,
      },
      {
        keyText: '사진업로드',
        valText: () => <ImageUpload files={files} setFiles={setFiles} />,
        isHalf: false,
      },
      {
        keyText: '미리보기',
        valText: () => (
          <>
            {files.length > 0
              ? files.map((file) => (
                  <div key={file.name}>
                    <img src={file.preview} className={classes.previewImage} />
                  </div>
                ))
              : '파일 없음'}
          </>
        ),
        isHalf: false,
      },
    ],
    [loginImageQuery.data, files]
  );
  let handleEditBtnClick = () => {
    console.log('edit');
  };
  let handleSaveBtnClick = () => {
    if (files.length) {
      uploadImage.mutate(files[0]);
    } else {
      alert('no file there');
    }
  };
  let handleCancelBtnClick = () => {
    console.log('cancel');
  };
  return (
    <>
      <PageSubtitle
        textContent={'로그인 이미지'}
        // renderEndSection={() => (
        //   <StartIconButton category="edit" onClick={handleEditBtnClick} />
        // )}
      />
      {loginImageQuery.isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="30vh"
        >
          <CircularProgress size={100} />
        </Box>
      ) : (
        <Fragment>
          <Box mb={5}>
            <KeyValueTable dataSource={dataSource} />
          </Box>
          <SaveButtonSection
            onSave={handleSaveBtnClick}
            onCancel={handleCancelBtnClick}
          />
        </Fragment>
      )}
    </>
  );
}
