import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import PRAppbar from './Appbar';
import PRSidebar from './Sidebar';

import styled from "styled-components";
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "../../redux/state";

import HideOff from "../../asset/hide_button_off.svg";
import HideOn from "../../asset/hide_button_on.svg";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(5),
    },
}));

export default function DashboardTypeLayout({ children }) {
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = useState(false);  
    const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Set Drawaer
    const setDrawerStatus = (bool) => {    
        setIsDrawer(bool);
    };

    return (
        <Container>
            <HideBtn active={isdrawer} onClick={() => setDrawerStatus(!isdrawer)}>
                <img src={isdrawer ? HideOn : HideOff} alt="" />
            </HideBtn>
            <PRAppbar handleDrawerToggle={handleDrawerToggle} />
            {
                isdrawer &&
                <PRSidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}/>
            }
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {children}
            </main>
        </Container>
    );
}
const Container = styled.div`
    display: flex;
    @media (min-width: 1920px) {
        min-width: ${(props) => (props.active ? "1560px" : "1920px")};
    }
    @media (min-width: 1440px) and (max-width: 1919px) {
        min-width: ${(props) => (props.active ? "1030px" : "1440px")};
    }
    @media (min-width: 10px) and (max-width: 1439px) {
        min-width: ${(props) => (props.active ? "680px" : "1024px")};
    }
`;

const HideBtn = styled.div`
    width: 32px;
    height: 112px;
    background-color: #000000;
    position: fixed;
    display: flex;
    align-items: center;
    padding-left: 7px;
    top: 50px;
    left: ${(props) => (props.active ? "300px" : "0px")};
    z-index: 999999;
    border-top-right-radius: 18px;
    border-bottom-right-radius: 18px;
    cursor: pointer;
    box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.12);
`;