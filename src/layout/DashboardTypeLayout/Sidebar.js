import {Divider,Drawer,Grid,Hidden,makeStyles,SvgIcon,Typography,useTheme} from '@material-ui/core';
import React from 'react';
import { ReactComponent as BrandLogo } from 'asset/images/logo_w.svg';
import { drawerWidth } from './LayoutConsts';
import SidebarNavigation from './SidebarNavigation';

const useStyles = makeStyles((theme) => ({
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,flexShrink: 0,
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    drawerHeader: {
        // backgroundColor: theme.palette.primary.main,
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        paddingLeft: theme.spacing(5),
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    drawerHeaderText: {},
    logoRoot: {
        width: '3em',
        height: '3em',
    },
}));

const PersistentDrawer = React.forwardRef(function PersistentDrawer(props,ref) {
    const classes = useStyles();
    return (
        <div ref={ref}>
            <Grid
                container
                justify="flex-start"
                alignItems="center"
                className={classes.toolbar}
                classes={{ root: classes.drawerHeader }}
            >
                <Typography
                    variant="h4"
                    noWrap
                    classes={{ root: classes.drawerHeaderText }}
                >
                    <SvgIcon
                        component={BrandLogo}
                        viewBox="0 0 122 102"
                        classes={{ root: classes.logoRoot }}
                    />
                </Typography>
            </Grid>
            <SidebarNavigation />
            <Divider />
        </div>
    );
});

export default function PRSidebar({ mobileOpen, handleDrawerToggle, window }) {
    const classes = useStyles();
    const theme = useTheme();
    const container = window !== undefined ? () => window().document.body : undefined;
    
    return (
        <nav className={classes.drawer} aria-label="cms sidebar">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="css">
                <Drawer
                    container={container}
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    <PersistentDrawer />
                </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                >
                    <PersistentDrawer />
                </Drawer>
            </Hidden>
        </nav>
    );
}