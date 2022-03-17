import {Box,CircularProgress,FormControl,makeStyles,OutlinedInput} from '@material-ui/core';
import { apiObject } from 'api';
import Feedback from 'components/Feedback';
import KeyValueTable from 'components/KeyValueTable';
import PageSubtitle from 'components/PageSubtitle';
import SaveButtonSection from 'components/SaveButtonSection';
import React, { useRef, useState } from 'react';
import { Fragment } from 'react';
import dayjs from 'dayjs';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { fetchSubscr } from './common';
import * as utils from "../../utils"

const useStyles = makeStyles(() => ({
    textAreaInput: {
        border: 0,
    },
    buttomWrap : {
        flex:1,
        display:'flex',
        flexDirection:'row',
        justifyContent:'flex-end'
    }
}));

export default function SubscrDetailPage() {
    const classes = useStyles();
    const { subscrId } = useParams();
    const queryClient = useQueryClient();
    let nowDate = new Date();
    const inputRef = useRef(null);
    let history = useHistory();

    const SubscrDetailQuery = useQuery(['Subscr', 'detail', subscrId],
        () => fetchSubscr(subscrId),
        {}
    );

    
    const dataSource = React.useMemo(() =>
        SubscrDetailQuery.isLoading
        ? []
        : [
            {
                keyText: '신청자',
                valText: SubscrDetailQuery.data.input_id == 'Admin' ? "[" + SubscrDetailQuery.data.brand_nm + "]관리자등록" : "[" + SubscrDetailQuery.data.brand_nm + "]" + SubscrDetailQuery.data.user_nm,
                isHalf: true,
            },
            {
                keyText: '신청일자',
                valText: SubscrDetailQuery.data.subscr_req_dt3,
                isHalf: true,
            },
            {
                keyText: '구독분류',
                valText: SubscrDetailQuery.data.subscr_type_name,
                isHalf: true,
            },
            {
                keyText: '결제금액',
                valText: utils.numberWithCommas(SubscrDetailQuery.data.subscr_chrge_amt),
                isHalf: true,
            },
            {
                keyText: '결제상태',
                valText: SubscrDetailQuery.data.settlement_type_name + "[" +  SubscrDetailQuery.data.settle_complet_yn_str + "]",
                isHalf: true,
            },
            {
                keyText: '결제일자',
                valText: SubscrDetailQuery.data.settle_dt3,
                isHalf: true,
            },    
            {
                keyText: '주문번호',
                valText: SubscrDetailQuery.data.merchant_uid,
                isHalf : false
            },            
            {
                keyText: '구독시작일',
                valText: SubscrDetailQuery.data.subscr_begin_de3,
                isHalf: true,
            },
            {
                keyText: '구독만료일',
                valText: SubscrDetailQuery.data.subscr_end_de3,
                isHalf: true,
            },
            {
                keyText: '취소여부',
                valText: SubscrDetailQuery.data.canc_yn ? '취소함' : '유지중',
                isHalf: true,
            },
            {
                keyText: '갱신중',
                valText: SubscrDetailQuery.data.next_renew_yn ? 'YES' : 'NO',
                isHalf: true,
            },
        ],
            [SubscrDetailQuery.data]
    );

    
    const handleListBtnClick = () => {
        history.goBack();
    };

    const handleCancelClick = () => {
        if (confirm('정말로 구독을 취소하시겠습니까?')) {
            cancleSubscribe.mutate({
                subscr_no : SubscrDetailQuery.data.subscr_no,
                subscr_man_id : SubscrDetailQuery.data.subscr_man_id,
                brand_id : SubscrDetailQuery.data.brand_id,
            });
        }
    };
    const cancleSubscribe = useMutation(
		["brand-user-cancleSubscribe"],
		(value) =>
            apiObject.cancleSubscribe(
            {
                subscr_no: value.subscr_no,  
                subscr_man_id: value.subscr_man_id,  
                brand_id: value.brand_id,  
            },
            () => {}
            ),
        {
            onSuccess: () => {
                alert('정상적으로 취소되었습니다');
                SubscrDetailQuery.refetch();
            },
            onError: () => {
                alert("수정 중 오류가 발생했습니다.");
            },
        }
    );

    console.log('dd',SubscrDetailQuery.data)
    return (
        <>
            <PageSubtitle textContent="구독관리 상세내역 " />
            {
            SubscrDetailQuery.isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="30vh">
                    <CircularProgress size={100} />
                </Box>
            ) : (
                <Fragment>
                    <Box mb={2.5}>
                        <KeyValueTable dataSource={dataSource} />
                    </Box>
                    { ( parseInt(dayjs(SubscrDetailQuery.data.subscr_end_de).unix()) > parseInt(dayjs(nowDate).unix())  && SubscrDetailQuery.data.canc_yn == false ) ?
                    <div style={{display:'flex', flexDirection:'row',flexGrow:1,justifyContent:'flex-end'}}>
                        <div style={{width:200}}>
                            <SaveButtonSection
                                onCancel={handleCancelClick}
                                cancelText="구독취소"    
                            />
                        </div>
                        <div style={{width:200}}>
                            <SaveButtonSection
                                onCancel={handleListBtnClick}
                                cancelText="목록"    
                            />
                        </div>
                    </div>
                    :
                    <SaveButtonSection
                        onCancel={handleListBtnClick}
                        cancelText="목록"    
                    />
                    }
                    
                </Fragment>
            )}
        </>
    );
}
