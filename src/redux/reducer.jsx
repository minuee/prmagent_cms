import { CurrentAuthUiState, UserState } from '@psyrenpark/auth';

const INITIAL_STATE = {
  isLoading: false, // 로딩 상태
  // currentAuthUiState: CurrentAuthUiState.SIGN_IN, // 인증 화면 상태
  // currentAuthUiState: CurrentAuthUiState.CHANGE_PASSWORD, // 인증 화면 상태
  userState: UserState.NOT_SIGN, // 인증 상태
  myAuth: {}, // 인증관련 정보
  myUser: {}, // 로그인후 유저 정보
};

export default (state = INITIAL_STATE, { type, payload, routeName }) => {
  switch (type) {
    case 'SET_IS_LOGIN':
      return { ...state, isLogin: payload };

    case 'SET_MY_USER':
      return { ...state, myUser: payload };

    case 'SET_IS_EXIST_LANG_FILE':
      return { ...state, isExistLangFile: payload };

    case 'SET_IS_AUTO_LOGIN':
      return {
        ...state,
        isLogin: payload.isLogin,
        isExistLangFile: payload.isExistLangFile,
      };

    case 'SET_IS_LOADING':
      return { ...state, isLoading: payload };

    case 'SET_CURRENT_AUTH_UI_STATE':
      return { ...state, currentAuthUiState: payload };

    case 'SET_MY_AUTH':
      return { ...state, myAuth: payload };

    case 'SET_USER_STATE':
      return {
        ...state,
        currentAuthUiState: CurrentAuthUiState.SIGN_IN,
        userState: payload,
      };

    case 'SIGN_IN':
      return {
        ...state,
        currentAuthUiState: CurrentAuthUiState.SIGN_IN,
        userState: UserState.SIGNED,
        myUser: payload,
      };

    case 'SIGN_OUT':
      return {
        ...state,
        currentAuthUiState: CurrentAuthUiState.SIGN_IN,
        userState: UserState.NOT_SIGN,
      };

    default:
      return state;
  }
};
