import { Box, CircularProgress,FormControl,makeStyles,OutlinedInput } from '@material-ui/core';
import styled, { css } from 'styled-components';
import { CloseOutlined } from '@material-ui/icons';
import { darken } from 'polished';
import BaseTable from 'components/BaseTable';
import KeyValueTable from 'components/KeyValueTable';
import PageSubtitle from 'components/PageSubtitle';
import SaveButtonSection from 'components/SaveButtonSection';
import ImageUpload from 'components/ImageUpload';
import dayjs from 'dayjs';
import React, { useRef, useState, useEffect } from 'react';
import { Fragment } from 'react';
import { useQuery, useMutation } from 'react-query';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { fetchUserDetail } from './common';
import { phoneFormat, numberWithCommas } from 'utils';
import { apiObject } from 'api';

import DetailTable from 'components/DetailTable';
import { USER_DETAIL_TABLE, USER_DETAIL_TABLE_STYLIST } from './UsersPageMock';
import ImgIcon from 'asset/images/img_icon.svg';

const useStyles = makeStyles(() => ({
    textAreaInput: {
        border: 0,
    },
    zeroPadding: {
        padding: 0,
    },
}));

export default function UserDetailPage() {
    const classes = useStyles();
    const { userId, userType } = useParams();
    const { state: locationState } = useLocation();
    const colorInputRef = useRef(null);
    const [logoImg, setLogoImg] = useState({
        url: '',
        file: null,
        name: '',
        uploadYn: false,
    });
    
    const IMAGE_URL = 'https://fpr-prod-file.s3-ap-northeast-2.amazonaws.com/';

    const handleImgUpload = ({ target }) => {
        const name = target.accept.includes('image/png, image/jpg') ? 'images' : 'noImage';
        let img = new Image();
        img.src = URL.createObjectURL(target.files[0]);
        img.onload = function () {
            if (name === 'images') {
                setLogoImg({
                    url: URL.createObjectURL(target.files[0]),
                    file: target.files[0],
                    name: target.files[0].name,
                    uploadYn: true,
                });
                target.value = null;
            }
        };
    };

    const userDetailQuery = useQuery(['user', 'detail', userId, userType],
        () => fetchUserDetail(userId, userType),{}
    );

    const columns = React.useMemo(() => [
    {
        Header: '구독 종류',
        accessor: 'SUBSCRIPT_TYPE',
    },
    {
        Header: '구독시작일',
        accessor: 'begin_dt',
    },
    {
        Header: '구독만료일',
        accessor: 'end_dt',
    },
    {
        Header: '가격',
        accessor: 'pay',
    },
    ],
        []
    );

    // subscript data
    const subScriptData = React.useMemo(() =>
        userDetailQuery.isLoading
        ? 
        []
        : 
        userDetailQuery.data.subscript_history.map((item) => ({
            ...item,
            SUBSCRIPT_TYPE: item.SUBSCRIPT_TYPE ?? '-',
            begin_dt: item.begin_dt ? dayjs.unix(item.begin_dt).format('YYYY-MM-DD') : '-',
            end_dt: item.end_dt ? dayjs.unix(item.end_dt).format('YYYY-MM-DD') : '-',
            pay: item.pay ? numberWithCommas(item.pay) : '-',
        })),
        [userDetailQuery.data, userId]
    );

    const data = React.useMemo(() =>
        userDetailQuery.isLoading
        ? 
        []
        : 
        userDetailQuery.data.user_type !== 'STYLIST'
        ? 
        {
            user_no: userDetailQuery.data.user_no,
            user_nm: userDetailQuery.data.user_nm,
            brand_id: userDetailQuery.data.brand_id,
            mgzn_id: userDetailQuery.data.mgzn_id,
            user_type: userDetailQuery.data.user_type,
            company_nm: userDetailQuery.data.company_nm,
            position: userDetailQuery.data.position,
            reg_dt: userDetailQuery.data.reg_dt,
            subscript_type: userDetailQuery.data.subscript_type,
            active_text: userDetailQuery.data.active_text,
            expire_dt: userDetailQuery.data.expire_dt,
            amount: userDetailQuery.data.amount,
            user_color : userDetailQuery.data.user_color,
            origin_logo_img_url : userDetailQuery.data.logo_img_url,
            user_color_form : (
                <FormControl variant="outlined" fullWidth={true}>
                    <OutlinedInput
                        id="user_color_form"
                        placeholder={'대표색상을 입력하세요(RGB, ex:#efefef)'}
                        classes={{notchedOutline: classes.textAreaInput,input: classes.zeroPadding}}
                        inputRef={colorInputRef}
                        defaultValue={userDetailQuery.data.user_color}
                    />
                </FormControl>
            ),
            logo_img_url: (
                <LogoImgWrap>
                    <input
                        accept="image/png, image/jpg"
                        id="logo-img-input"
                        name="logo-img"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleImgUpload}
                    />
                    {
                    logoImg.url !== '' ? (
                        <>
                            <LogoImgWrap>
                                <label htmlFor="logo-img-input" style={{ cursor: 'pointer' }}>
                                    <LogoImgDiv>
                                        <img src={ImgIcon} alt="" />
                                        {logoImg.name}
                                    </LogoImgDiv>
                                </label>
                                <StyledCloseIcon
                                    onClick={() => setLogoImg({url: '',file: null,name: '',uploadYn: false,})}
                                />
                            </LogoImgWrap>
                            <label htmlFor="logo-img-input">
                                <LogoBtn>파일업로드</LogoBtn>
                            </label>
                        </>
                    ) : (
                        <>
                            <label htmlFor="logo-img-input" style={{ cursor: 'pointer' }}>
                                <LogoImgDiv>
                                    <img src={ImgIcon} alt="" />
                                    파일없음
                                </LogoImgDiv>
                            </label>
                            <label htmlFor="logo-img-input" onClick={() => setLogoImg({ ...logoImg, uploadYn: false })}>
                                <LogoBtn>파일업로드</LogoBtn>
                            </label>
                        </>
                    )
                    }
                </LogoImgWrap>
            ),
            preview: (
                <PreviewWrap>
                    {logoImg.url !== '' ? (
                        <>
                            <PreviewImg>
                                <img
                                    src={logoImg.uploadYn ? logoImg.url : IMAGE_URL + userDetailQuery.data.logo_img_url}
                                    alt=""
                                />
                            </PreviewImg>
                            <StyledCloseIcon onClick={() => setLogoImg({url: '',file: null,name: '',uploadYn: false,})}/>
                        </>
                    ) : (
                        '-'
                    )}
                </PreviewWrap>
            ),
        }
        : {
            user_no: userDetailQuery.data.user_no,
            user_nm: userDetailQuery.data.user_nm,
            user_type: userDetailQuery.data.user_type,
            company_nm: userDetailQuery.data.company_nm,
            position: userDetailQuery.data.position,
            reg_dt: userDetailQuery.data.reg_dt,
            subscript_type: userDetailQuery.data.subscript_type,
            active_text: userDetailQuery.data.active_text,
            expire_dt: userDetailQuery.data.expire_dt,
            amount: userDetailQuery.data.amount,
            user_color : userDetailQuery.data.user_color,
        }
    );

    const updateQuery = useMutation((value) => apiObject.setUserLogoImgUpdate(value),{
        onSuccess: () => {
            alert('등록/변경되었습니다.');
        },
        onError: (error) => {
            console.log('errrr',error)
            alert('등록/변경 중 오류가 발생했습니다.');
        },
    });

    let history = useHistory();
    let handleSaveBtnClick = () => {
        if (confirm('정보를 수정 하시겠습니까?')) {
            
            if (logoImg.uploadYn ) {                
                if (data.user_type === 'BRAND') {
                    updateQuery.mutate({
                        user_type: data.user_type,
                        brand_id: data.brand_id,
                        img_file: logoImg.file, 
                        img_regist : true,
                        user_color: colorInputRef.current.value,
                    });
                } else if (data.user_type === 'MAGAZINE') {
                    updateQuery.mutate({
                        user_type: data.user_type,
                        mgzn_id: data.mgzn_id,
                        img_file: logoImg.file,
                        img_regist : true,
                        user_color: colorInputRef.current.value,
                    });
                }
            }else if ( colorInputRef.current.value !== data.user_color) {                
                if (data.user_type === 'BRAND') {
                    updateQuery.mutate({
                        user_type: data.user_type,
                        brand_id: data.brand_id,
                        img_file: data.origin_logo_img_url, 
                        img_regist : false,
                        user_color: colorInputRef.current.value,
                    });
                } else if (data.user_type === 'MAGAZINE') {
                    updateQuery.mutate({
                        user_type: data.user_type,
                        mgzn_id: data.mgzn_id,
                        img_file: data.origin_logo_img_url,
                        img_regist : false,
                        user_color: colorInputRef.current.value,
                    });
                }             
            } else {
                alert('변경된 내용이 없습니다.');
            }
        }
    };
    let handleCancelBtnClick = () => {
        setLogoImg({url: '',file: null,name: '',uploadYn: false,});
        userDetailQuery.refetch();
    };

    useEffect(() => {
        !userDetailQuery.isLoading &&
        userDetailQuery.data.user_type !== 'STYLIST' &&
        !logoImg.uploadYn &&
        userDetailQuery.data.logo_img_url !== null &&
        setLogoImg({
            ...logoImg,
            url: userDetailQuery.data.logo_img_url || '',
            name: userDetailQuery.data.logo_img_url.replace('public/showroomImage/','') || '',
        });
        return () => {};
    }, [userDetailQuery]);

    return (
        <>
            <PageSubtitle textContent="사용자 관리" />
            {userDetailQuery.isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="30vh">
                    <CircularProgress size={100} />
                </Box>
            ) : (        
                <>
                    <DetailTable
                        data={data}
                        header={data.user_type !== 'STYLIST' ? USER_DETAIL_TABLE : USER_DETAIL_TABLE_STYLIST}
                    />
                    {
                        data.user_type !== 'STYLIST' && (
                        <BtnGroup>
                            <Btn type="cancel" onClick={handleCancelBtnClick}>취소</Btn>
                            <Btn type="confirm" onClick={handleSaveBtnClick}>저장</Btn>
                        </BtnGroup>
                        )
                    }
                    <PageSubtitle textContent="User History" />
                    <Box mb={5}>
                        <BaseTable
                            columns={columns}
                            data={subScriptData}
                            hasPagination={false}
                        />
                    </Box>
                    <BtnGroup>
                        <Btn type="cancel" onClick={() => history.push('/pr/users')}>목록</Btn>
                    </BtnGroup>
                </>
            )}
        </>
    );
}

const LogoImgWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 20px;
`;

const LogoImgDiv = styled.div`
    display: flex;
    align-items: center;
    > img {
        margin-right: 14px;
    }
`;

const LogoBtn = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 106px;
    height: 34px;
    background-color: #7ea1b2;
    color: #ffffff;
    font-weight: normal;
    cursor: pointer;
    &:hover {
        background-color: ${darken(0.05, '#7ea1b2')};
    }
    &:active {
        background-color: ${darken(0.1, '#7ea1b2')};
    }
`;

const PreviewWrap = styled.div`
    display: flex;
`;
const PreviewImg = styled.div`
    width: 128px;
    height: 48px;
    border: solid 1px #ededed;
    display: flex;
    align-items: center;
    justify-content: center;
    > img {
        max-width: 128px;
        max-height: 48px;
    }
`;

const StyledCloseIcon = styled(CloseOutlined)`
    width: 20px;
    height: 20px;
    margin-left: 5px;
    cursor: pointer;
`;

const Label = styled.label`
    display: flex;
    align-items: center;
    cursor: pointer;
    > img {
        margin-right: 14px;
    }
`;

const BtnGroup = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 40px;
`;

const Btn = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 180px;
    height: 50px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    ${(props) => props.type === 'confirm'? 
    css`
        color: #ffffff;
        background-color: #7ea1b2;
        &:hover {
            background-color: ${darken(0.05, '#7ea1b2')};
        }
        &:active {
            background-color: ${darken(0.1, '#7ea1b2')};
        }
    `
    : 
    css`
        color: #606060;
        background-color: #ffffff;
        border: solid 2px #dddddd;
        &:hover {
            background-color: ${darken(0.05, '#ffffff')};
        }
        &:active {
            background-color: ${darken(0.1, '#ffffff')};
        }
    `}

    & + & {
        margin-left: 20px;
    }
`;