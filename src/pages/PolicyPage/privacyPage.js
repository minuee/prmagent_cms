import {
  Box,
  CircularProgress,
  FormControl,
  makeStyles,
  OutlinedInput,
} from '@material-ui/core';
import PageSubtitle from 'components/PageSubtitle';
import SaveButtonSection from 'components/SaveButtonSection';
import StartIconButton from 'components/StartIconButton';
import React, { useEffect, useState } from 'react';
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
export default function PrivacyPage() {
  const classes = useStyles();
  const queryClient = useQueryClient();

  const privacyPolicyQuery = useQuery(
    ['privacy-policy'],
    () => apiObject.getPrivacyPolicy(),
    {}
  );

  const saveNewPrivacyPolicy = useMutation(
    ['privacy-policy'],
    (privacy_policy) =>
      apiObject.setPrivacyPolicy(
        {
          privacy_policy,
        },
        () => {}
      ),
    {
      // onSuccess: () => {
      //   queryClient.setQueryData(
      //     ['feedback-msg'],
      //     '개인정보 처리방침을 수정했습니다.'
      //   );
      //   queryClient.setQueryData(['feedback-severity'], 'success');
      // },
      // onError: () => {
      //   queryClient.setQueryData(['feedback-msg'], '문제가 발생했습니다.');
      //   queryClient.setQueryData(['feedback-severity'], 'error');
      // },
      onSettled: () => {
        queryClient.invalidateQueries(['privacy-policy']);
      },
    }
  );

  let handleEditBtnClick = () => {
    console.log('edit');
  };
  let handleSaveBtnClick = () => {
    saveNewPrivacyPolicy.mutate(
      value.replace(
        '<table>',
        '<table border="1" style="border-collapse: collapse;width: 100%">'
      )
    );
  };
  let handleCancelBtnClick = () => {
    console.log('cancel');
    console.log(
      value.replace(
        '<table>',
        '<table border="1" style="border-collapse: collapse;width: 100%">'
      )
    );
  };

  const [value, setValue] = useState('');
  useEffect(() => {
    if (!privacyPolicyQuery.isLoading) {
      setValue(privacyPolicyQuery.data.privacy_policy);
    }
    return () => {};
  }, [privacyPolicyQuery.data]);
  return (
    <div>
      <PageSubtitle
        textContent="개인정보처리방침"
        renderEndSection={() => (
          <StartIconButton category="edit" onClick={handleEditBtnClick} />
        )}
      />
      {privacyPolicyQuery.isLoading ? (
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
