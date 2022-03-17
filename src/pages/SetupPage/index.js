import {Box,Grid,Button,Checkbox,CircularProgress,FormControl,makeStyles,OutlinedInput,Radio} from '@material-ui/core';
import { apiObject } from 'api';
import ImageUpload from 'components/ImageUpload';
import KeyValueTable from 'components/KeyValueTable';
import PageSubtitle from 'components/PageSubtitle';
import SaveButtonSection from 'components/SaveButtonSection';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { Fragment } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { fetchSetupData } from './common';
import * as utils from "utils";

const useStyles = makeStyles(() => ({
  textAreaInput: {
    border: 0,
  },
  zeroPadding: {
    padding: 0,
  },
  buttonRoot: {
    minWidth: '180px',
    fontSize: '1rem',
    minHeight: '50px',
  },
}));
export default function SetupPage() {
  const classes = useStyles();
  const queryClient = useQueryClient();
  let history = useHistory();
  const tel_listInputRef = useRef(null);
  const [inputs, setInputs] = useState({
    tel_list : ""
  }); 
  const noticeDetailQuery = useQuery(
    ['setup', 'getinfo' ],
    () => fetchSetupData(),
    {}
  );

  const saveSetupInfo = useMutation(
    ['setup', 'setinfo'],
    (value) =>
      apiObject.setIndividualSetup(
        {
          tel_list: value.tel_list
        },
        () => {}
      ),
    {
      onSuccess: () => {
        /* queryClient.setQueryData(
          ['feedback-msg'],
          '환경설정을 저장했습니다.'
        ); */
		window.alert('환경설정을 저장했습니다.')
        queryClient.setQueryData(['feedback-severity'], 'success');
      },
      onError: () => {
        queryClient.setQueryData(['feedback-msg'], '문제가 발생했습니다.');
        queryClient.setQueryData(['feedback-severity'], 'error');
      },
      onSettled: () => {
        queryClient.invalidateQueries(['setup', 'getinfo']);
      },
    }
  );


  const handleCompleteBtnClick = () => {
    saveSetupInfo.mutate({
		tel_list: tel_listInputRef.current.value.trim(),
    });
  };



  const dataSource = React.useMemo(
    () =>
      noticeDetailQuery.isLoading
        ? []
        : [
            {
              keyText: '관리자연락처',
              valText: () => (
                <FormControl variant="outlined" fullWidth={true}>
                  <OutlinedInput
                    id="notice-content"
                    placeholder={'한개의 전화번호만 입력해주세요'}
                    classes={{
                      notchedOutline: classes.textAreaInput,
                      input: classes.zeroPadding,
                    }}
                    inputRef={tel_listInputRef}
                    defaultValue={noticeDetailQuery.data.alarm_phone}
                  />
                </FormControl>
              ),
              isHalf: false,
            },
          ],
    [noticeDetailQuery.data,inputs]
  );
 

  
  return (
    <>
      <PageSubtitle
        textContent="환경설정"
        renderEndSection={() => (
          <Button variant="contained" color="secondary" disableElevation >
            회원가입시 알림을 받을 연락처를 입력하세요. 1개만 등록가능합니다.
          </Button>
        )}
      />
      {noticeDetailQuery.isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="30vh">
          <CircularProgress size={100} />
        </Box>
      ) : (
        <Fragment>
			<Box mb={5}>
				<KeyValueTable dataSource={dataSource} />
			</Box>
		  
         	<Grid container spacing={2} justify="flex-end">
				<Grid item>
					<Button
						variant="contained"
						color="primary"
						onClick={handleCompleteBtnClick}
						disableElevation={true}
						className={classes.buttonRoot}
					>
					저장
					</Button>
				</Grid>
			</Grid>
		</Fragment>
      )}
    </>
  );
}


export { SetupPage };