import React, { useRef } from 'react';
import LoginPageBackground from 'asset/images/login-bg.png';
import { ReactComponent as BrandLogo } from 'asset/images/logo.svg';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  Link,
  makeStyles,
  OutlinedInput,
  SvgIcon,
  Typography,
} from '@material-ui/core';

import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import { Link as RouterLink, useHistory } from 'react-router-dom';

//-------------------------------------------
// redux
import { useDispatch, useSelector } from 'react-redux';

import {
  Auth,
  CurrentAuthUiState,
  AuthType,
  UserState,
} from '@psyrenpark/auth';
import useLocalStorageState from 'hook/useLocalStorageState';

const useStyles = makeStyles((theme) => ({
  loginBg: {
    background: `center / cover no-repeat url(${LoginPageBackground})`,
    minHeight: '100vh',
    backgroundColor: theme.palette.common.black,
  },
  loginCard: {
    backgroundColor: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(7.5),
    paddingTop: theme.spacing(12.5),
    paddingBottom: theme.spacing(18),
  },
  logoRoot: {
    width: '5em',
    height: '5em',
  },
  fullWidthBox: { width: '100%' },
  formRoot: {
    '& > *:not(:last-child)': {
      paddingBottom: theme.spacing(2.5),
    },
  },
  inputRoot: {
    borderRadius: '30px',
  },
  inputStyle: {
    paddingLeft: theme.spacing(2),
  },
  inputStartIcon: {
    width: '1.5em',
    height: '1.5em',
    fill: '#9b9b9b',
  },
  searchIcon: {
    // verticalAlign: 'middle',
  },
  lognBtnRoot: {
    padding: theme.spacing(2.25),
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: '#333',
    },
    borderRadius: '30px',
  },
  loginBtnLabel: {
    fontSize: '1.5rem',
    lineHeight: 1.5,
  },
}));

export default function LoginPage() {
  const classes = useStyles();
  const history = useHistory();
  const inputRef = useRef(null);
  const passwordRef = useRef(null);

  const reducer = useSelector((state) => state.reducer);
  const dispatch = useDispatch();
  const [rememberId, setRememberId] = useLocalStorageState(
    'remember_id_tf',
    false
  );
  const [storageId, setStorageId] = useLocalStorageState('storage_id', '');

  const handleLoginBtnClick = () => {
    if (rememberId) {
      setStorageId(inputRef.current.value);
    } else {
      setStorageId('');
    }

    Auth.signInProcess(
      {
        authType: AuthType.EMAIL,
        // email: 'admin@ruu.kr',
        // password: 'admin@ruu.kr',
        email: inputRef.current.value.trim(),
        password: passwordRef.current.value.trim(),
      },
      async (data) => {
        // 성공처리

        // dispatch({ type: "SET_CURRENT_AUTH_UI_STATE", payload: isLoading });
        // // 유저 정보 가져오기

        // var userData = await apiObject.getUser({
        //   langCode: "ko",
        //   loadingFunction,
        // });
   
        dispatch({
          type: 'SIGN_IN',
          payload: {
            user: 'admin@ruu.kr',
          },
        });
        history.push('/pr/set-login-image');

        // alert("로그인 성공");

        // history.push('/pr/set-login-image');
      },
      (data) => {
   
        // dispatch({
        //   type: "SET_CURRENT_AUTH_UI_STATE",
        //   payload: CurrentAuthUiState.CONFIRM_SIGN_UP,
        // });
      },
      (error) => {
        // 실패처리,
    
        alert(error.message);
      },
      () => {}
    );
  };

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      handleLoginBtnClick();
    }
  };

  return (
    <Grid container alignItems="center" className={classes.loginBg}>
      <Container
        maxWidth="sm"
        className={classes.loginCard}
        disableGutters={true}
      >
        <SvgIcon
          component={BrandLogo}
          viewBox="0 0 160 160"
          classes={{ root: classes.logoRoot }}
        />
        <Box mt={7} className={classes.fullWidthBox}>
          <form className={classes.formRoot} noValidate autoComplete="off">
            <FormControl variant="outlined" fullWidth={true}>
              <OutlinedInput
                id="loginpage-input-id"
                placeholder="ID"
                inputRef={inputRef}
                classes={{ root: classes.inputRoot, input: classes.inputStyle }}
                defaultValue={rememberId ? storageId : ''}
                startAdornment={
                  <InputAdornment position="start">
                    <PersonOutlineOutlinedIcon
                      className={classes.inputStartIcon}
                    />
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl variant="outlined" fullWidth={true}>
              <OutlinedInput
                id="loginpage-input-password"
                placeholder="PASSWORD"
                inputRef={passwordRef}
                type="password"
                classes={{ root: classes.inputRoot, input: classes.inputStyle }}
                onKeyPress={handleEnterPress}
                startAdornment={
                  <InputAdornment position="start">
                    <LockOutlinedIcon className={classes.inputStartIcon} />
                  </InputAdornment>
                }
              />
            </FormControl>
          </form>
        </Box>

        <Box
          mt={3}
          className={classes.fullWidthBox}
          display="flex"
          alignItems="center"
        >
          <Grid container>
            <Grid item xs={6} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberID"
                    color="primary"
                    checked={rememberId}
                    onChange={() => setRememberId(!rememberId)}
                  />
                }
                label="아이디 저장"
              />
            </Grid>
            {/* <Grid item xs={6} sm={8} container alignItems="center">
              <SearchOutlinedIcon className={classes.searchIcon} />
              <Link
                component={RouterLink}
                to="/find-user"
                color="inherit"
                className={classes.linkStyle}
              >
                <Typography>ID/PW 찾기</Typography>
              </Link>
            </Grid> */}
          </Grid>
        </Box>
        <Box mt={4} className={classes.fullWidthBox}>
          <Button
            variant="contained"
            disableElevation={true}
            fullWidth={true}
            classes={{
              root: classes.lognBtnRoot,
              label: classes.loginBtnLabel,
            }}
            onClick={handleLoginBtnClick}
          >
            로그인
          </Button>
        </Box>
      </Container>
    </Grid>
  );
}
