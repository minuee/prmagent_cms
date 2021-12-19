import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import {
  Box,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
} from '@material-ui/core';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

import FindUserPage from 'pages/FindUserPage';
import LoginPage from 'pages/LoginPage';
import TestPage from 'pages/TestPage';
import DashboardRoutes from 'routes/DashboardRoutes';
import theme from './theme';

import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

//--------------------------------------------------
// redux
import { Provider, useDispatch, useSelector } from 'react-redux';

import {
  Auth,
  CurrentAuthUiState,
  AuthType,
  UserState,
} from '@psyrenpark/auth';
import { Api } from '@psyrenpark/api';
import { Storage } from '@psyrenpark/storage';
import awsmobile from './aws-exports';

dayjs.locale('ko');

const queryClient = new QueryClient();

Auth.setConfigure(awsmobile);
Api.setConfigure(awsmobile);
Storage.setConfigure(awsmobile);
function App() {
  const [initialLoading, setInitialLoading] = useState(true);
  const reducer = useSelector((state) => state.reducer);
  const dispatch = useDispatch();

  const checkAuth = async () => {
    try {
      var auth = await Auth.currentSession();
      console.log('checkAuth -> auth', auth);

      dispatch({
        type: 'SET_USER_STATE',
        payload: UserState.SIGNED,
      });
    } catch (error) {
      console.log('checkToLogin -> error', error);

      dispatch({
        type: 'SET_USER_STATE',
        payload: UserState.NOT_SIGN,
      });
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    // 정규식 필요
    checkAuth();
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {initialLoading ? (
            <Box
              width="100vw"
              height="100vh"
              // bgcolor="#000"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress size={100} />
            </Box>
          ) : (
            <Box>
              {reducer.userState === UserState.NOT_SIGN ? (
                <Router>
                  <Switch>
                    <Route exact path="/">
                      <LoginPage />
                    </Route>
                    <Route exact path="/find-user">
                      <FindUserPage />
                    </Route>
                    <Redirect to="/" />
                  </Switch>
                </Router>
              ) : (
                <Router>
                  <Switch>
                    <Route path="/pr" component={DashboardRoutes} />
                    <Route path="/">
                      <Redirect to="/pr/set-login-image" />
                    </Route>
                    <Route path="*">
                      <div>NO MATCH</div>
                    </Route>
                  </Switch>
                </Router>
              )}
            </Box>
          )}
        </ThemeProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

export default App;
