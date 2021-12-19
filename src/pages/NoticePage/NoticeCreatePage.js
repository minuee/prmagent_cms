import {Box,Checkbox,FormControl,makeStyles,OutlinedInput,Radio} from '@material-ui/core';
import { apiObject } from 'api';
import ImageUpload from 'components/ImageUpload';
import KeyValueTable from 'components/KeyValueTable';
import PageSubtitle from 'components/PageSubtitle';
import SaveButtonSection from 'components/SaveButtonSection';
import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import * as utils from "../../utils";
//import * as newUtils from "../../utils/newUtils"

const useStyles = makeStyles(() => ({
    textAreaInput: {
        border: 0,
    },
    zeroPadding: {
        padding: 0,
    },
}));

export default function NoticeCreatePage() {
    const classes = useStyles();
    let history = useHistory();
    const queryClient = useQueryClient();
    const titleInputRef = useRef(null);
    const contentInputRef = useRef(null);
    const showYnInputRef = useRef(null);
    const [inputs, setInputs] = useState({
        recv_type : "all"
      }); 

    const createNewNotice = useMutation(['notice', 'new'],
        ({ title, content, show_yn, file , recv_type}) =>
            apiObject.createNewNotice({title,content,show_yn,file,recv_type},
                () => {}
            ),
        {
            onSuccess: () => {
                queryClient.setQueryData(['feedback-msg'], '공지사항을 생성했습니다.');
                queryClient.setQueryData(['feedback-severity'], 'success');
            },
            onError: () => {
                queryClient.setQueryData(['feedback-msg'], '문제가 발생했습니다.');
                queryClient.setQueryData(['feedback-severity'], 'error');
            },
            onSettled: () => {
                history.goBack();
            },
        }
    );

    const handleRecvTypeCheckBoxChange = (e) => {
        const value = e.target.value;
        setInputs({ ...inputs, [e.target.name]: value });
      };

    const handleDisplayCheckBoxChange = () => {};
        const [files, setFiles] = useState([]);
        useEffect(
            () => () => {
                // Make sure to revoke the data uris to avoid memory leaks
                files.forEach((file) => URL.revokeObjectURL(file.preview));
            },
            [files]
        );
        const dataSource = React.useMemo(() => [{
            keyText: '제목',
            valText: () => (
                <FormControl variant="outlined" fullWidth={true}>
                    <OutlinedInput
                        id="notice-content"
                        placeholder={'공지 내용을 입력해주세요.'}
                        classes={{notchedOutline: classes.textAreaInput,input: classes.zeroPadding}}
                        inputRef={titleInputRef}
                        defaultValue={''}
                    />
                </FormControl>
            ),
            isHalf: false,
        },
        {
            keyText: '발송대상',
            valText: () =>(    
            <Box display="flex" alignItems="center">
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
            ),
            isHalf: false,
          },
        {
            keyText: '노출허용',
            valText: () => (
                <Checkbox
                    defaultChecked
                    color="default"
                    inputProps={{ 'aria-label': 'checkbox for notice exposure' }}
                    onClick={(e) => handleDisplayCheckBoxChange(e)}
                    name="1"
                    inputRef={showYnInputRef}
                />
            ),
            isHalf: false,
            disableGutter: true,
        },
        {
            keyText: '사진업로드',
            valText: () => <ImageUpload files={files} setFiles={setFiles} />,
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
                        defaultValue={''}
                    />
                </FormControl>
            ),
            isHalf: false,
        },
    ],
        [files,inputs]
    );  

    const handleCompleteBtnClick = () => {

        if ( utils.isEmpty(titleInputRef.current.value)) {
            alert('제목을 입력하세요');
            return;
        }else if ( utils.isEmpty(contentInputRef.current.value)) {
            alert('내용을 입력하세요');
            return;
        }else{
            createNewNotice.mutate({
                title: titleInputRef.current.value,
                content: contentInputRef.current.value,
                show_yn: showYnInputRef.current.checked,
                file: files.length ? files[0] : null,
                recv_type: inputs.recv_type,
            });
        }
    };

    const handleListBtnClick = () => {
        history.goBack();
    };

    return (
        <>
            <PageSubtitle textContent="공지사항" />
            <Box mb={5}>
                <KeyValueTable dataSource={dataSource} />
            </Box>
            <SaveButtonSection
                onSave={handleCompleteBtnClick}
                onCancel={handleListBtnClick}
                cancelText="취소"
                saveText="저장"
            />
        </>
    );
}