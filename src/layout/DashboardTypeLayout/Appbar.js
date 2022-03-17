import React from 'react';
import {AppBar,Box,Button,Grid,IconButton,makeStyles,SvgIcon,Toolbar,Typography,useScrollTrigger,} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { ReactComponent as BrandLogo } from 'asset/images/logo.svg';

import { ReactComponent as SettingIcon } from 'asset/images/settings.svg';
import { drawerWidth } from './LayoutConsts';
import { useHistory } from 'react-router-dom';
import { Auth, AuthType, UserState } from '@psyrenpark/auth';
import { useDispatch } from 'react-redux';
import styled from "styled-components";
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "../../redux/state";

const useStyles = makeStyles((theme) => ({
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,minWidth : `680px`,marginLeft: drawerWidth,
        },
    },
    hideAppBar : {
        [theme.breakpoints.up('sm')]: {
            width: `100%`,minWidth : `680px`, 
        },
    },
    StretchedToolbar: {
        alignItems: 'stretch',
    },
    xsAppbar: {
        paddingLeft: theme.spacing(2),alignItems: 'center',
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    logoRoot: {
        width: '3em',height: '3em',
    },
    profileAvatar: {
        fontSize: '3rem',marginRight: theme.spacing(3),
    },
    iconBtn: {
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.18)',
        },
    },
    logoutBtn: {
        padding: theme.spacing(4),
        color: theme.palette.common.white,
        backgroundColor: theme.palette.common.black,
        '&:hover': {
            backgroundColor: theme.palette.grey['900'],
        },
        borderRadius: 0,
    },
}));

const HeaderContainer = styled.div`
    display: flex;
    @media (min-width: 1920px) {
        max-width: ${(props) => (props.active ? "1560px" : "1920px")};
    }
    @media (min-width: 1440px) and (max-width: 1919px) {
        max-width: ${(props) => (props.active ? "1030px" : "1440px")};
    }
    @media (min-width: 10px) and (max-width: 1439px) {
        max-width: ${(props) => (props.active ? "680px" : "1024px")};
    }
`;

function ElevationScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

export default function PRAppbar(props) {
    const { handleDrawerToggle } = props;
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);

    const handleButtonClick = () => {
        Auth.signOutProcess(
        {
            authType: AuthType.EMAIL,
        },
        async (data) => {
            // 성공처리
            dispatch({type: 'SIGN_OUT',});
        },
        (error) => {
            // 실패처리,
            alert(error.message);
        },
        (isLoading) => {
            // 로딩처리
            // dispatch({ type: "SET_IS_LOADING", payload: isLoading });
        });
    };

    return (
        <ElevationScroll {...props}>
            <HeaderContainer>
                <AppBar position="fixed" color="default" className={isdrawer ? classes.appBar : classes.hideAppBar}>
                    <Toolbar disableGutters classes={{ root: classes.StretchedToolbar }}>
                        <Grid container justify="space-between">
                            <Grid
                                item
                                container
                                xs={6}
                                sm="auto"
                                className={classes.xsAppbar}
                                classes={{ root: classes.menuButton }}
                            >
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                    className={classes.menuButton}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Typography variant="h4" noWrap className={classes.menuButton}>
                                    <SvgIcon
                                        component={BrandLogo}
                                        viewBox="0 0 122 102"
                                        classes={{ root: classes.logoRoot }}
                                    />
                                </Typography>
                            </Grid>
                            <Grid item container justify="flex-end" xs={3} sm={12}>
                                <Box display="flex" alignItems="center">
                                    {/* <IconButton
                                    aria-label="help"
                                    classes={{ root: classes.iconBtn }}
                                    >
                                    <HelpOutlineOutlinedIcon />
                                    </IconButton> */}
                                    <AccountCircleIcon fontSize="large" classes={{ root: classes.profileAvatar }} />
                                    <Typography>관리자</Typography>
                                    <Box pr={5} pl={2.5}>
                                        {/* <IconButton
                                        aria-label="settings"
                                        classes={{ root: classes.iconBtn }}
                                        >
                                        <SettingIcon />
                                        </IconButton> */}
                                    </Box>
                                </Box>
                                <Button classes={{ root: classes.logoutBtn }} onClick={handleButtonClick}>
                                    Logout
                                </Button>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </HeaderContainer>
        </ElevationScroll>
    );
}