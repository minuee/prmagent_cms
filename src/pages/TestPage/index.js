import React from 'react';

//-------------------------------------------
// redux
import { useDispatch, useSelector } from 'react-redux';

import {
  Auth,
  CurrentAuthUiState,
  AuthType,
  UserState,
} from '@psyrenpark/auth';

import { apiObject } from '../../api';

export default function TestPage() {
  const reducer = useSelector((state) => state.reducer);
  const dispatch = useDispatch();

  const signOutFunction = async () => {
    Auth.signOutProcess(
      {
        authType: AuthType.EMAIL,
      },
      async (data) => {
        // 성공처리
     
        dispatch({
          type: 'SIGN_OUT',
        });

        alert('로그아웃');
      },
      (error) => {
        // 실패처리,
    
        alert(error.message);
      },
      (isLoading) => {
        // 로딩처리
        // dispatch({ type: "SET_IS_LOADING", payload: isLoading });
      }
    );
  };

  const testApiFunction = async () => {
    try {
      var result = await apiObject.getTestApi(
        {
          langCode: 'ko',
        },
        () => {}
      );

      alert(JSON.stringify(result));
    } catch (error) {
      if (error.response) {
        // Request made and server responded

      } else if (error.request) {
        // The request was made but no response was received
    
      } else {
        // Something happened in setting up the request that triggered an Error
      
      }
    }
  };

  return (
    <div style={{ color: 'black' }}>
      <h1>FINDUSER</h1>
      <button onClick={signOutFunction}>로그아웃</button>
      <button onClick={testApiFunction}>테스트 api</button>
    </div>
  );
}
