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
import { fetchSubscr } from './common';
import * as utils from "../../utils"

const useStyles = makeStyles(() => ({
    textAreaInput: {
        border: 0,
    },
}));

export default function SubscrDetailPage() {
    const classes = useStyles();
    const { subscrId } = useParams();
    const queryClient = useQueryClient();

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
                valText: "[" + SubscrDetailQuery.data.brand_nm + "]" + SubscrDetailQuery.data.user_nm,
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
                    <SaveButtonSection                        
                        onCancel={handleListBtnClick}
                        cancelText="목록"                        
                    />
                </Fragment>
            )}
        </>
    );
}
