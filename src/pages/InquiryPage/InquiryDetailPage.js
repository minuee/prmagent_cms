import {Box,CircularProgress,FormControl,makeStyles,OutlinedInput} from '@material-ui/core';
import { apiObject } from 'api';
import Feedback from 'components/Feedback';
import KeyValueTable from 'components/KeyValueTable';
import PageSubtitle from 'components/PageSubtitle';
import SaveButtonSection from 'components/SaveButtonSection';
import React, { useRef, useState } from 'react';
import { Fragment } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { fetchInquiry } from './common';
import * as utils from "../../utils"

const useStyles = makeStyles(() => ({
    textAreaInput: {
        border: 0,
    },
}));

export default function InquiryDetailPage() {
    const classes = useStyles();
    const { inquiryId } = useParams();
    const queryClient = useQueryClient();

    const inputRef = useRef(null);
    let history = useHistory();

    const inquiryDetailQuery = useQuery(['inquiry', 'detail', inquiryId],
        () => fetchInquiry(inquiryId),
        {}
    );

    const saveNewInquiryAnswer = useMutation(['inquiry', 'detail', inquiryId],
        (value) =>
            apiObject.setNewInquiryAnswer({
                sys_inquiry_no: inquiryId,
                answer: value,
            },
                () => {}
            ),
            {
                onSuccess: () => {
                    queryClient.setQueryData(['feedback-msg'],'문의사항 답변을 저장했습니다.');
                    queryClient.setQueryData(['feedback-severity'], 'success');
                },
                onError: () => {
                    queryClient.setQueryData(['feedback-msg'], '문제가 발생했습니다.');
                    queryClient.setQueryData(['feedback-severity'], 'error');
                },
                onSettled: () => {
                    queryClient.invalidateQueries(['inquiry', 'detail', inquiryId]);
                    history.push('/pr/inquiry');
                },
            }
    );

    const dataSource = React.useMemo(() =>
        inquiryDetailQuery.isLoading
        ? []
        : [
            {
                keyText: '제목',
                valText: inquiryDetailQuery.data.title,
                isHalf: true,
            },
            {
                keyText: '작성자',
                valText: inquiryDetailQuery.data.user_nm,
                isHalf: true,
            },
            {
                keyText: '내용',
                valText: inquiryDetailQuery.data.content,
                isHalf: false,
            },
        ],
            [inquiryDetailQuery.data]
    );

    const textAreaDataSource = React.useMemo(() => [
        {
            keyText: '답변내용',
            valText: () => (
                <FormControl variant="outlined" fullWidth={true}>
                    <OutlinedInput
                        id="inquiry-reply"
                        multiline={true}
                        placeholder={'답변내용을 입력해주세요.'}
                        classes={{ notchedOutline: classes.textAreaInput }}
                        inputRef={inputRef}
                        rows={5}
                        rowsMax={5}
                        defaultValue={inquiryDetailQuery.isLoading ? '' : inquiryDetailQuery.data.answer_yn ? inquiryDetailQuery.data.answer : ''}
                    />
                </FormControl>
            ),
            isHalf: false,
        },
        ],
            [inquiryDetailQuery.data]
    );

    const handleCompleteBtnClick = () => {
        if ( utils.isEmpty(inputRef.current.value)) {
            alert('답변내용을  입력하세요');
            return;
        }else{
            const message = "답변을 등록하시겠습니까?";
            if (window.confirm(message)) {
                saveNewInquiryAnswer.mutate(inputRef.current.value);
            } else {
            return;  
            }
        }
        
    };
    
    const handleListBtnClick = () => {
        history.goBack();
    };

    return (
        <>
            <PageSubtitle textContent="문의내역" />
            {
            inquiryDetailQuery.isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="30vh">
                    <CircularProgress size={100} />
                </Box>
            ) : (
                <Fragment>
                    <Box mb={2.5}>
                        <KeyValueTable dataSource={dataSource} />
                    </Box>
                    <Box mb={5}>
                        <KeyValueTable dataSource={textAreaDataSource} />
                    </Box>
                    <SaveButtonSection
                        onSave={handleCompleteBtnClick}
                        onCancel={handleListBtnClick}
                        cancelText="목록"
                        saveText="답변완료"
                    />
                </Fragment>
            )}
        </>
    );
}
