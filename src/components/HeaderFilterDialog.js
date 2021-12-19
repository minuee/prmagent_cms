import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { darken } from 'polished';
import {FormControl,InputAdornment,OutlinedInput,makeStyles,} from '@material-ui/core';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import { useQuery } from 'react-query';
import { apiObject } from 'api';

import SelectBox from './SelectBox';
import SearchResult from './SearchResult';
import { SORTING_OPTIONS } from 'pages/UsersPage/UsersPageMock';

const useStyles = makeStyles((theme) => ({
    inputStartIcon: {
        fill: '#999',
    },
    inputStyle: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
}));

export default function HeaderFilterDialog({
    open,
    setOpen,
    checked,
    setChecked,
    searchText,
    filterActive,
    setFilterActive,
    align,
    setAlign,
    type,
    isRightSorting = false,
    handleFilterConfirm,
    handleFilterInit,
}) {
    const classes = useStyles();
    const [data, setData] = useState(0);
    const [defaultOpt, setDefaultOpt] = useState(null);
    const [beforeSearch, setBeforeSearch] = useState('');
    const [filterSearch, setFilterSearch] = useState('');

    const handleEnterPress = (e) => {
        if (e.key === 'Enter') {
            setFilterSearch(beforeSearch);
        }
    };

    const handleSubmit = () => {
        if (checked[type].length === 0 && data === 0 && data === '0') {
            alert('데이터 또는 정렬값을 선택해주세요.');
            return;
        } else {
            handleFilterConfirm(type);
            setFilterActive({
                ...filterActive,
                [type]: true,
            });
            data !== 0 && data !== '0' && setAlign({ order: type, asc: data });
            setOpen(type);
        }
    };

    const handleInit = () => {
        if (align.order === type) {
            setAlign({ order: '', asc: true });
            setData(0);
        }
        handleFilterInit(type);
        setFilterActive({
            ...filterActive,
            [type]: false,
        });
        setOpen(type);
    };

    const searchResultQuery = useQuery(
    [
        'userlist-filter',
        type,
        filterSearch,
        searchText.num,
        searchText.user_nm,
        searchText.user_type_text,
        searchText.company_nm,
        searchText.position,
        searchText.subscript_type,
        searchText.active_text,
        searchText.amount_excel,
    ],
    () =>
        apiObject.getUserListFilter({
            search_text: filterSearch,
            search_filter: type,
            num_search_text_str: searchText.num,
            user_nm_search_text_str: searchText.user_nm,
            user_type_text_search_text_str: searchText.user_type_text,
            company_search_text_str: searchText.company_nm,
            potision_search_text_str: searchText.position,
            subscript_type_search_text_str: searchText.subscript_type,
            active_text: searchText.active_text,
            amount_search_text_str: searchText.amount_excel,
        })
    );

    useEffect(() => {
        if (!searchResultQuery.isLoading) {
            let newArr = [];
            newArr.push({ value: 0, label: '모두선택' });
            if ( type == 'user_type_text')  console.log('searchResultQuery.data.list',type,searchResultQuery.data.list)
            searchResultQuery.data.list.map((d, i) =>
                newArr.push({
                    value: i + 1,
                    label:
                        type === 'num'
                        ? d.num
                        : type === 'user_nm'
                        ? d.user_nm
                        : type === 'user_type_text'
                        ? d.user_type_text
                        : type === 'company_nm'
                        ? d.company_nm
                        : type === 'position'
                        ? d.position
                        : type === 'subscript_type'
                        ? d.subscript_type || '-'
                        : type === 'active_text'
                        ? d.active_text
                        : d.amount || '-',
                })
            );
            if ( type == 'user_type_text')  console.log('newArr',type,newArr)
            setDefaultOpt(newArr);
        }
    }, [searchResultQuery]);

    useEffect(() => {
        if (align.order === type) {
            setData(align.asc);
        } else {
            setData(0);
        }
    }, [align]);

    return (
        !searchResultQuery.isLoading && (
            <>
                {
                open && (
                    <Container sort={isRightSorting}>
                        <div style={{ marginBottom: '12px' }}>
                            <SelectBox value={data} setValue={setData} opt={SORTING_OPTIONS} />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <FormControl variant="outlined">
                                <StyledInput
                                    id="search-input"
                                    value={beforeSearch}
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyPress={handleEnterPress}
                                    onChange={(e) => setBeforeSearch(e.target.value)}
                                    placeholder="검색 내용을 입력하세요."
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <SearchOutlinedIcon className={classes.inputStartIcon} />
                                        </InputAdornment>
                                    }
                                    classes={{ input: classes.inputStyle }}
                                />
                            </FormControl>
                        </div>
                        <SearchResultWrap onClick={(e) => e.stopPropagation()}>
                            {
                                defaultOpt !== null &&
                                    defaultOpt.map((d) => (
                                        <SearchResult
                                            key={d.value}
                                            data={d.label}
                                            type={type}
                                            checked={checked}
                                            setChecked={setChecked}
                                            opt={defaultOpt}
                                        />
                                    ))
                            }
                        </SearchResultWrap>
                        <BtnWrap onClick={(e) => e.stopPropagation()}>
                            <Btn onClick={handleInit}>필터 지우기</Btn>
                            <BtnConfirm onClick={handleSubmit}>필터 적용</BtnConfirm>
                        </BtnWrap>
                    </Container>
                )
            }
        </>
        )
    );
}

const Container = styled.div`
    position: absolute;
    top: 20px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    width: 340px;
    height: auto;
    padding: 32px;
    background-color: #ffffff;
    border: solid 1px #d9d9d9;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.08);
    ${(props) => props.sort ? css`right: 15px;` : css`left: 15px;`}
`;

const StyledInput = styled(OutlinedInput)`
    width: 276px;
    height: 34px;
    border-radius: 0;
    .MuiInputBase-root {
        font-size: 15px;
    }
    .MuiOutlinedInput-notchedOutline {
        border-color: #dddddd;
    }
`;

const SearchResultWrap = styled.div`
    width: 276px;
    height: 175px;
    border: solid 1px #dddddd;
    padding: 16px;
    overflow: auto;
`;

const BtnWrap = styled.div`
    display: flex;
    width: 276px;
    align-items: center;
    justify-content: space-between;
    margin-top: 27px;
`;

const Btn = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 34px;
    border: solid 1px #dddddd;
    font-size: 14px;
    font-weight: normal;
    color: #505050;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
        background-color: ${darken(0.05, '#ffffff')};
    }
    &:active {
        background-color: ${darken(0.1, '#ffffff')};
    }
`;

const BtnConfirm = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 34px;
    background-color: #7ea1b2;
    font-size: 14px;
    font-weight: normal;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
        background-color: ${darken(0.05, '#7ea1b2')};
    }
    &:active {
        background-color: ${darken(0.1, '#7ea1b2')};
    }
`;