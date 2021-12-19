import {Box,Button,Checkbox,CircularProgress,FormControl,makeStyles,OutlinedInput,Radio} from '@material-ui/core';
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
import { fetchNotice } from './common';

const useStyles = makeStyles(() => ({
  textAreaInput: {
    border: 0,
  },
  zeroPadding: {
    padding: 0,
  },
}));
export default function NoticeDetailPage() {
  const classes = useStyles();
  const { noticeId } = useParams();
  const queryClient = useQueryClient();
  let history = useHistory();
  const [inputs, setInputs] = useState({
    recv_type : "all"
  }); 
  const titleInputRef = useRef(null);
  const contentInputRef = useRef(null);
  const showYnInputRef = useRef(null);
  
 

  const noticeDetailQuery = useQuery(
    ['notice', 'detail', noticeId],
    () => fetchNotice(noticeId),
    {}
  );

  const saveNoticeDetail = useMutation(
    ['notice', 'detail', noticeId],
    (value) =>
      apiObject.setIndividualNotice(
        {
          notice_no: noticeId,
          title: value.title,
          content: value.content,
          show_yn: value.show_yn,
          file: value.file,
          img_url_adres: value.img_url_adres,
          recv_type : value.recv_type
        },
        () => {}
      ),
    {
      onSuccess: () => {
        queryClient.setQueryData(
          ['feedback-msg'],
          '공지사항 내용을 저장했습니다.'
        );
        queryClient.setQueryData(['feedback-severity'], 'success');
        history.goBack();
      },
      onError: () => {
        queryClient.setQueryData(['feedback-msg'], '문제가 발생했습니다.');
        queryClient.setQueryData(['feedback-severity'], 'error');
      },
      onSettled: () => {
        queryClient.invalidateQueries(['notice', 'detail', noticeId]);
      },
    }
  );

  const deleteNoticeMutation = useMutation(
    ['notice', 'delete', noticeId],
    () => apiObject.deleteNotice({ notice_no: noticeId }),
    {
      onSuccess: () => {
        queryClient.setQueryData(
          ['feedback-msg'],
          '해당 공지사항을 삭제했습니다.'
        );
        queryClient.setQueryData(['feedback-severity'], 'warning');
      },
      onError: () => {
        queryClient.setQueryData(['feedback-msg'], '문제가 발생했습니다.');
        queryClient.setQueryData(['feedback-severity'], 'error');
      },
      onSettled: () => {
        queryClient.invalidateQueries(['notice']);
        history.goBack();
      },
    }
  );

  const pushNoticeMutation = useMutation(
    ['notice', 'sendpush', noticeId],
    () => apiObject.sendPushNotice({ notice_no: noticeId , target_group : inputs.recv_type}),
    {
      onSuccess: () => {
        /* queryClient.setQueryData(
          ['feedback-msg'],
          '정상적으로 발송되었습니다..'
        );
        queryClient.setQueryData(['feedback-severity'], 'warning'); */
        alert('정상적으로 발송되었습니다.')
      },
      onError: () => {
        queryClient.setQueryData(['feedback-msg'], '문제가 발생했습니다.');
        queryClient.setQueryData(['feedback-severity'], 'error');
      },
      
    }
  );

  const handleCompleteBtnClick = () => {
    saveNoticeDetail.mutate({
      title: titleInputRef.current.value,
      content: contentInputRef.current.value,
      show_yn: showYnInputRef.current.checked,      
      file: files.length ? files[0] : null,
      img_url_adres: noticeDetailQuery.data.img_url_adres,
      recv_type: inputs.recv_type,
    });
  };
  const handleListBtnClick = () => {
    history.goBack();
  };

  const handleDeleteNotice = () => {
    deleteNoticeMutation.mutate();
  };

  const handlePushNotice = () => {    
    if (confirm( "알림을 발송하시겠습니까?")) {
      pushNoticeMutation.mutate();
    }    
  };

  const handleDisplayCheckBoxChange = () => {}; 

  const handleRecvTypeCheckBoxChange = (e) => {
    const value = e.target.value;
    setInputs({ ...inputs, [e.target.name]: value });
  };
  const [files, setFiles] = useState([]);
  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      setInputs({ ...inputs,  recv_type :noticeDetailQuery.data.recv_type});
    },
    [noticeDetailQuery]
  );
  
  const dataSource = React.useMemo(
    () =>
      noticeDetailQuery.isLoading
        ? []
        : [
            {
              keyText: '제목',
              valText: () => (
                <FormControl variant="outlined" fullWidth={true}>
                  <OutlinedInput
                    id="notice-content"
                    placeholder={'공지 내용을 입력해주세요.'}
                    classes={{
                      notchedOutline: classes.textAreaInput,
                      input: classes.zeroPadding,
                    }}
                    inputRef={titleInputRef}
                    defaultValue={noticeDetailQuery.data.title}
                  />
                </FormControl>
              ),
              isHalf: false,
            },
            {
              keyText: '작성자',
              valText: noticeDetailQuery.data.mngr_nm,
              isHalf: true,
            },
            {
              keyText: '조회수',
              valText: noticeDetailQuery.data.view_count,
              isHalf: true,
            },
            {
              keyText: '노출허용',
              valText: () => (
                <Checkbox
                  defaultChecked={noticeDetailQuery.data.show_yn}
                  color="default"
                  inputProps={{ 'aria-label': 'checkbox for notice exposure' }}
                  onClick={(e) => handleDisplayCheckBoxChange(e)}
                  name="1"
                  inputRef={showYnInputRef}
                />
              ),
              isHalf: true,
              disableGutter: true,
            },
            {
              keyText: '등록일',
              valText: dayjs
                .unix(noticeDetailQuery.data.reg_dt)
                .format('YYYY-MM-DD'),
              isHalf: true,
            },
            {
              keyText: '사진업로드',
              valText: () =>
                noticeDetailQuery.data.img_url_adres ? (
                  <Fragment>
                    {noticeDetailQuery.data.img_url_adres}
                    <ImageUpload files={files} setFiles={setFiles} />
                  </Fragment>
                ) : (
                  <ImageUpload files={files} setFiles={setFiles} />
                ),
              isHalf: false,
            },
            {
              keyText: '내용',
              valText: () => (
                <FormControl variant="outlined" fullWidth={true}>
                  <OutlinedInput
                    id="notice-content"
                    multiline={true}
                    placeholder={'공지 내용을 입력해주세요.'}
                    classes={{ notchedOutline: classes.textAreaInput }}
                    inputRef={contentInputRef}
                    rows={5}
                    rowsMax={5}
                    defaultValue={noticeDetailQuery.data.content}
                  />
                </FormControl>
              ),
              isHalf: false,
            },
            {
              keyText: '발송대상',
              valText: () =>(                
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box alignItems="center">
                    <Radio
                      checked={inputs.recv_type === 'all'}
                      onChange={handleRecvTypeCheckBoxChange}
                      value="all"
                      name="recv_type"
                      inputProps={{ 'aria-label': 'recv_type' }}
                    />전체
                    <Radio
                      checked={inputs.recv_type === 'brand'}
                      onChange={handleRecvTypeCheckBoxChange}
                      value="brand"
                      name="recv_type"
                      inputProps={{ 'aria-label': 'recv_type' }}
                    />브랜드
                    <Radio
                      checked={inputs.recv_type === 'magazine'}
                      onChange={handleRecvTypeCheckBoxChange}
                      value="magazine"
                      name="recv_type"
                      inputProps={{ 'aria-label': 'recv_type' }}
                    />매거진                    
                  </Box>
                  
                  <Button variant="contained" color="secondary" disableElevation onClick={handlePushNotice}>
                    알림발송
                  </Button>
                </Box>
              ),
              isHalf: false,
            },
          ],
    [noticeDetailQuery.data, files,inputs]
  );
 

  
  return (
    <>
      <PageSubtitle
        textContent="공지사항"
        renderEndSection={() => (
          <Button variant="contained" color="secondary" disableElevation onClick={handleDeleteNotice}>
            공지 삭제
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
          <SaveButtonSection
            onSave={handleCompleteBtnClick}
            onCancel={handleListBtnClick}
            cancelText="목록"
            saveText="저장"
          />
        </Fragment>
      )}
    </>
  );
}
