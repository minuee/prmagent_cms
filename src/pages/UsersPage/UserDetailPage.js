import { Box, Typography,Grid,CircularProgress,FormControl,makeStyles,OutlinedInput } from '@material-ui/core';
import styled, { css } from 'styled-components';
import { CloseOutlined } from '@material-ui/icons';
import { darken } from 'polished';
import BaseTable from 'components/BaseTable';
import KeyValueTable from 'components/KeyValueTable';
import PageSubtitle from 'components/PageSubtitle';
import SaveButtonSection from 'components/SaveButtonSection';
import ImageUpload from 'components/ImageUpload';
import dayjs from 'dayjs';
import React, { useRef, useState, useEffect,useCallback } from 'react';
import { useQuery, useMutation } from 'react-query';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { fetchUserDetail } from './common';
import { phoneFormat, numberWithCommas } from 'utils';
import { apiObject } from 'api';

import DetailTable from 'components/DetailTable';
import FilterDialog from "./FilterDialog";
import { USER_DETAIL_TABLE, USER_DETAIL_TABLE_STYLIST } from './UsersPageMock';
import ImgIcon from 'asset/images/img_icon.svg';

const useStyles = makeStyles((theme) => ({
    textAreaInput: {
        border: 0,
    },
    zeroPadding: {
        padding: 0,
    },
    titleContainer: {
        marginBottom: theme.spacing(2.25),
    },
    gridWrap : {
        flex:1,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    SubtitleText: {
        fontWeight: 'bold',
    },
}));


export default function UserDetailPage() {
    const classes = useStyles();
    const { userId, userType } = useParams();
    const { state: locationState } = useLocation();
    const colorInputRef = useRef(null);
    const orderValueInputRef = useRef(null);
    const [logoImg, setLogoImg] = useState({
        url: '',
        file: null,
        name: '',
        uploadYn: false,
    });
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);

    const handleFilterClick = useCallback(() => {
        setFilterDialogOpen(true);
    }, [filterDialogOpen]);

    const handleFilterDialogOpen = useCallback(() => {
        setFilterDialogOpen(false);
        setLogoImg({url: '',file: null,name: '',uploadYn: false});
        userDetailQuery.refetch();
    },[])
    const closeFilterDialogOpen = useCallback(() => {
        setFilterDialogOpen(false);
    },[])
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
        Header: '구독신청일',
        accessor: 'reg_dt',
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
        Header: '취소일',
        accessor: 'canc_dt',
    },
    {
        Header: '가격',
        accessor: 'pay',
    },
    {
        Header: '비고',
        accessor: 'regist_type',
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
            reg_dt: item.reg_dt ? dayjs.unix(item.reg_dt).format('YYYY-MM-DD') : '-',
            canc_dt: item.canc_dt ? dayjs.unix(item.canc_dt).format('YYYY-MM-DD') : '-',
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
            order_value : userDetailQuery.data.order_value,
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
            order_value_form : (
                <FormControl variant="outlined" fullWidth={true}>
                    <OutlinedInput
                        id="order_value_form"
                        placeholder={'우선순위(기본 100, 작은수록 앞으로)'}
                        classes={{notchedOutline: classes.textAreaInput,input: classes.zeroPadding}}
                        inputRef={orderValueInputRef}
                        defaultValue={userDetailQuery.data.order_value}
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
            order_value: userDetailQuery.data.order_value,
        }
    );

    const updateQuery = useMutation((value) => apiObject.setUserLogoImgUpdate(value),{
        onSuccess: () => {
            alert('등록/변경되었습니다.');
        },
        onError: (error) => {
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
                        order_value: data.order_value,
                    });
                } else if (data.user_type === 'MAGAZINE') {
                    updateQuery.mutate({
                        user_type: data.user_type,
                        mgzn_id: data.mgzn_id,
                        img_file: logoImg.file,
                        img_regist : true,
                        user_color: colorInputRef.current.value,
                        order_value : 0
                    });
                }
            }else if ( colorInputRef.current.value !== data.user_color || orderValueInputRef.current.value !== data.order_value) {
                if (data.user_type === 'BRAND') {
                    updateQuery.mutate({
                        user_type: data.user_type,
                        brand_id: data.brand_id,
                        img_file: data.origin_logo_img_url, 
                        img_regist : false,
                        user_color: colorInputRef.current.value,
                        order_value : orderValueInputRef.current.value
                    });
                } else if (data.user_type === 'MAGAZINE') {
                    updateQuery.mutate({
                        user_type: data.user_type,
                        mgzn_id: data.mgzn_id,
                        img_file: data.origin_logo_img_url,
                        img_regist : false,
                        user_color: colorInputRef.current.value,
                        order_value: data.order_value,
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
                    <BtnGroup>                    
                        <Btn type="cancel" onClick={handleCancelBtnClick}>취소</Btn>
                        <Btn type="confirm" onClick={handleSaveBtnClick}>저장</Btn>                       
                        <Btn type="cancel" onClick={() => history.push('/pr/users')}>목록</Btn>
                    </BtnGroup>
                    { userDetailQuery.data.user_type === 'BRAND' && 
                    <>
                        
                        {/* <PageSubtitle textContent="구독 내역" />> */}
                        <Grid
                            container
                            classes={{ root: classes.titleContainer }}
                            justify="space-between"
                            alignItems="center"
                        >
                            <Grid item classes={{ root: classes.gridWrap }}>
                                <Typography
                                    variant="h5"
                                    classes={{ root: classes.SubtitleText }}
                                    display="inline"
                                >
                                구독 내역
                                </Typography>
                                <Btn type="cancel" onClick={handleFilterClick}>구독추가</Btn>
                            </Grid>                       
                        </Grid>
                        <Box mb={5}>
                            <BaseTable
                                columns={columns}
                                data={subScriptData}
                                hasPagination={false}
                            />
                        </Box>
                    </>
                    }
                    
                </>
            )}
            {userDetailQuery.isLoading 
            ?
            null
            :
            <FilterDialog
                open={filterDialogOpen}
                setOpen={handleFilterDialogOpen}
                setClose={closeFilterDialogOpen}
                userData={userDetailQuery}
            />
            }
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