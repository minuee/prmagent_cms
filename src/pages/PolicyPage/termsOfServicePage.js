import { Box, CircularProgress, makeStyles } from '@material-ui/core';
import PageSubtitle from 'components/PageSubtitle';
import SaveButtonSection from 'components/SaveButtonSection';
import StartIconButton from 'components/StartIconButton';
import React, { useEffect, useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { apiObject } from 'api';
import { Fragment } from 'react';

const useStyles = makeStyles(() => ({
  editorContainer: {
    '& .ck.ck-content.ck-editor__editable': {
      maxHeight: '60vh',
      minHeight: '60vh',
    },
  },
}));

export default function TermsOfServicePage() {
  const classes = useStyles();

  const queryClient = useQueryClient();

  const tosQuery = useQuery(['tos'], () => apiObject.getToS(), {});

  const saveNewToS = useMutation((tos) => apiObject.setToS({ tos }, () => {}), {
    // onSuccess: () => {
    //   queryClient.setQueryData(['feedback-msg'], '이용약관을 수정했습니다.');
    //   queryClient.setQueryData(['feedback-severity'], 'success');
    // },
    // onError: () => {
    //   queryClient.setQueryData(['feedback-msg'], '문제가 발생했습니다.');
    //   queryClient.setQueryData(['feedback-severity'], 'error');
    // },
    onSettled: () => {
      queryClient.invalidateQueries(['tos']);
    },
  });

  let handleEditBtnClick = () => {
    console.log(value);
    console.log('edit');
  };
  let handleSaveBtnClick = () => {
    saveNewToS.mutate(
      value.replace(
        '<table>',
        '<table border="1" style="border-collapse: collapse;width: 100%">'
      )
    );
  };
  let handleCancelBtnClick = () => {
    console.log('cancel');
  };

  const [value, setValue] = useState('');
  useEffect(() => {
    if (!tosQuery.isLoading) {
      setValue(tosQuery.data.tos);
    }
    return () => {};
  }, [tosQuery.data]);
  return (
    <div>
      <PageSubtitle
        textContent="이용약관"
        renderEndSection={() => (
          <StartIconButton category="edit" onClick={handleEditBtnClick} />
        )}
      />
      {tosQuery.isLoading ? (
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
          <Box mb={2.5} className={classes.editorContainer}>
            <CKEditor
              editor={ClassicEditor}
              data={value}
              onChange={(event, editor) => {
                setValue(editor.getData());
              }}
              config={{
                removePlugins: [
                  'Link',
                  'Image',
                  'ImageCaption',
                  'ImageStyle',
                  'ImageToolbar',
                  'ImageUpload',
                  'MediaEmbed',
                ],
              }}
            />
          </Box>
          <SaveButtonSection
            onSave={handleSaveBtnClick}
            onCancel={handleCancelBtnClick}
          />
        </Fragment>
      )}
    </div>
  );
}
