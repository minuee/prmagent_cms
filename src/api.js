//--------------------------------------
// api/index.js
import { DomainDisabledOutlined } from '@material-ui/icons';
import { Api } from '@psyrenpark/api';
import { Storage } from '@psyrenpark/storage';
import { v4 as uuidv4 } from 'uuid';
import * as utils from "utils";
var projectName = 'fpradmin'; // 각 프로젝트 단축명
var projectEnv = 'prod'; // 각 프로젝트 환경 // dev, test, prod

var v1Noneauth = `${projectName}-${projectEnv}-noneauth-v1`;
var v1Api = `${projectName}-${projectEnv}-api-v1`;
var v1Cdn = `${projectName}-${projectEnv}-cdn-v1`;

export const apiObject = {
  //------------------------------------------
  // 인증 없는 api
  /**
   * [] cdn 테스트
   * @param {string} langCode               - 예시 언어코드
   * @param {Function} LoadingCallback      - 로딩 콜백
   */
  getTestNoneauth: (
    {
      langCode, //
      // 필요에 맞게 파라미터를 넣는다.
      // ...
    },
    loadingFunction
  ) => {
    var apiName = v1Noneauth; // 인증 유, 인증 무 api 구분은 이부분이 다르다.
    var path = '/test_test_test'; // test_test_test는 무조건 테스트 api로써 반드시 작동한다.
    var myInit = {
      headers: {}, // OPTIONAL
      // body: {  // post나 put일경우 사용한다.
      //
      // },
      queryStringParameters: {
        langCode: langCode,
      },
      // response: true,  // axios 원형 response 필요할 경우 ture로 설정한다.
    };
    // get, post, put, del 상황에 맞게 사용한다
    return Api.get(apiName, path, myInit, loadingFunction);
  },

  //------------------------------------------
  // 인증 있는 api
  getTestApi: (
    {
      langCode,
      // ...
      // 필요에 맞게 파라미터를 넣는다.
    },
    loadingFunction
  ) => {
    var apiName = v1Api; // 인증 유, 인증 무 api 구분은 이부분이 다르다.
    var path = '/test_test_test';
    var myInit = {
      headers: {}, // OPTIONAL
      // body: {  // post나 put일경우 사용한다.
      //
      // },
      queryStringParameters: {
        langCode: langCode,
      },
      // response: true,  // axios 원형 response 필요할 경우 ture로 설정한다.
    };
    // get, post, put, del 상황에 맞게 사용한다
    return Api.get(apiName, path, myInit, loadingFunction);
  },

  //------------------------------------------
  // 개발계에 테스트시 (디폴트 계정으로만 테스트 가능)
  getTestCdn: (
    {
      langCode,
      // ...
      // 필요에 맞게 파라미터를 넣는다.
    },
    loadingFunction
  ) => {
    var apiName = v1Cdn; // 인증 유, 인증 무 api 구분은 이부분이 다르다.
    var path = '/test_test_test';
    var myInit = {
      headers: {}, // OPTIONAL
      // body: {  // post나 put일경우 사용한다.
      //
      // },
      queryStringParameters: {
        langCode: langCode,
      },
      // response: true,  // axios 원형 response 필요할 경우 ture로 설정한다.
    };

    // 테스트 필요시
    // 테스트가 필요할경우 로딩콜백 뒤에 {url, port}를 추가한다. // 백엔드 개발자에게 테스트 요청
    // get, post, put, del 상황에 맞게 사용한다
    return Api.get(apiName, path, myInit, loadingFunction, {
      url: 'http://18.177.73.12',
      port: 3006,
    });

    // return Api.get(apiName, path, myInit, loadingFunction);
  },

  getLoginImage: (loadingFunction) => {
    var apiName = v1Api;
    var path = '/cms/login-image';
    var init = {};

    return Api.get(apiName, path, init, loadingFunction);
  },
  setLoginImage: async ({ file }, loadingFunction = () => {}) => {
    const file_name = uuidv4();

    const file_extension = file.name
      .substring(file.name.lastIndexOf('.'), file.name.length)
      .toLowerCase();

    const key = `loginImage/${file_name}${file_extension}`;
    try {
      var data = await Storage.put(
        {
          key,
          object: file,
          config: {
            contentType: 'image/png', // "image/jpeg",
            level: 'public', //  public, protected, private
          },
        },
        loadingFunction // 로딩이 필요하다면 넣는다.
      );

      var apiName = v1Api;
      var path = '/cms/login-image';
      var init = {
        body: {
          img_adres: `public/${data.key}`,
        },
      };
      return Api.post(apiName, path, init, loadingFunction);
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  getUserList: async (
    {
      page,
      limit,
      num_search_text_str,
      user_nm_search_text_str,
      user_type_text_search_text_str,
      company_search_text_str,
      potision_search_text_str,
      // reg_dt_search_text_str,
      start_reg_dt,
      end_reg_dt,
      subscript_type_search_text_str,
      active_text,
      // expire_dt_search_text_str,
      start_expire_dt,
      end_expire_dt,
      amount_search_text_str,
      order,
      asc,
      excel_download,
    },
    loadingFunction = () => {}
  ) => {
    var apiName = v1Api;
    var path = '/cms/user-list';
    var init = {
      queryStringParameters: {
        page,
        limit,
        num_search_text_str,
        user_nm_search_text_str,
        user_type_text_search_text_str,
        company_search_text_str,
        potision_search_text_str,
        // reg_dt_search_text_str,
        start_reg_dt,
        end_reg_dt,
        subscript_type_search_text_str,
        active_text,
        // expire_dt_search_text_str,
        start_expire_dt,
        end_expire_dt,
        amount_search_text_str,
        order,
        asc,
        excel_download,
      },
    };
    return Api.get(apiName, path, init, loadingFunction);
  },

  getUserListFilter: ({
    search_text,
    search_filter,
    num_search_text_str,
    user_nm_search_text_str,
    user_type_text_search_text_str,
    company_search_text_str,
    potision_search_text_str,
    reg_dt_search_text_str,
    subscript_type_search_text_str,
    active_text,
    expire_dt_search_text_str,
    amount_search_text_str,
  }) => {
    var apiName = v1Api;
    var path = '/cms/user-list-filter';
    var init = {
      queryStringParameters: {
        search_text,
        search_filter,
        num_search_text_str,
        user_nm_search_text_str,
        user_type_text_search_text_str,
        company_search_text_str,
        potision_search_text_str,
        reg_dt_search_text_str,
        subscript_type_search_text_str,
        active_text,
        expire_dt_search_text_str,
        amount_search_text_str,
      },
    };
    return Api.get(apiName, path, init);
  },

  downloadUserExcel: async ({ search_text }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = '/cms/user-list';
    var init = {
      queryStringParameters: {
        search_text,
        excel_download: true,
      },
    };
    return Api.get(apiName, path, init, loadingFunction);
  },
  getUserDetail: async ({ user_id, user_type }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = `/cms/user/${user_id}`;
    var init = {
      queryStringParameters: {
        user_id,
        user_type,
      },
    };
    return await Api.get(apiName, path, init, loadingFunction);
  },
  setUserLogoImgUpdate: async ({ user_type, brand_id, mgzn_id, img_file , img_regist, user_color,order_value}) => {
    var apiName = v1Api;
    var path = '/cms/user/img-update';
    var init = {
      body: {
        user_type,
        brand_id,
        mgzn_id,
        user_color,
        order_value
      },
    };
    if ( img_regist ) {
      const file_name = uuidv4();
      const file_extension = img_file.name
        .substring(img_file.name.lastIndexOf('.'), img_file.length)
        .toLowerCase();
      const key = `showroomImage/${file_name}${file_extension}`;
      try {
        var data = await Storage.put({
          key,
          object: img_file,
          config: {
            contentType: 'image/png, image/jpg',
            level: 'public',
          },
        });
        init.body.logo_img_url = `public/${data.key}`;
      } catch (error) {
        console.error(error);
        return error;
      }
    }else{
      init.body.logo_img_url = img_file;
    }

    return Api.put(apiName, path, init);
  },

  getInquiryList: async (
    { page, limit, order, asc, start_dt, end_dt, excel_download ,filter_answeryn = null},
    loadingFunction = () => {}
  ) => {
    var apiName = v1Api;
    var path = `/cms/inquiry-list`;
    var init = {
      queryStringParameters: {
        page,
        limit,
        order,
        asc,
        start_dt,
        end_dt,
        excel_download,
        filter_answeryn : filter_answeryn === true ? 'true' : 'false'
      },
    };
    return await Api.get(apiName, path, init, loadingFunction);
  },

  downloadInquiryExcel: async (
    { order, asc, start_dt, end_dt },
    loadingFunction = () => {}
  ) => {
    var apiName = v1Api;
    var path = '/cms/inquiry-list';
    var init = {
      queryStringParameters: {
        order,
        asc,
        start_dt,
        end_dt,
        excel_download: true,
      },
    };
    return Api.get(apiName, path, init, loadingFunction);
  },

  getInquiryDetail: async ({ sys_inquiry_no }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = `/cms/inquiry/${sys_inquiry_no}`;
    var init = {
      queryStringParameters: {
        sys_inquiry_no,
      },
    };
    return await Api.get(apiName, path, init, loadingFunction);
  },

  setNewInquiryAnswer: async (
    { sys_inquiry_no, answer },
    loadingFunction = () => {}
  ) => {
    var apiName = v1Api;
    var path = `/cms/inquiry/${sys_inquiry_no}/answer`;
    var init = {
      body: {
        sys_inquiry_no,
        answer,
      },
    };
    return await Api.post(apiName, path, init, loadingFunction);
  },

  /* 여기서부터 추가된 구독관리 */
  getSubscrList: async (
    { page, limit, order, asc, start_dt, end_dt, excel_download ,filter_answeryn = null},
    loadingFunction = () => {}
  ) => {
    var apiName = v1Api;
    var path = `/cms/subscr-list`;
    var init = {
      queryStringParameters: {
        page,
        limit,
        order,
        asc,
        start_dt,
        end_dt,
        excel_download        
      },
    };
    return await Api.get(apiName, path, init, loadingFunction);
  },

  registSubscribe: async ({ subscr_man_id, brand_id,start_date,end_date,subscr_se_cd,subscr_status_cd,subscr_chrge_amt },loadingFunction = () => {}
  ) => {
    var apiName = v1Api;
    var path = `/cms/subscr-regist`;
    var init = {
      body: {
        subscr_man_id,
        brand_id,
        start_date,
        end_date,
        subscr_se_cd,
        subscr_status_cd,
        subscr_chrge_amt
      },
    };
    //console.log(('registSubscribe',init))
    return await Api.post(apiName, path, init, loadingFunction);
  },

  cancleSubscribe: async ({ subscr_no,subscr_man_id,brand_id },loadingFunction = () => {}
  ) => {
    var apiName = v1Api;
    var path = `/cms/subscr-cancel`;
    var init = {
      queryStringParameters: {
        subscr_no,
        subscr_man_id,
        brand_id
      },
    };
    //console.log(('cancleSubscribe',init))
    return await Api.del(apiName, path, init, loadingFunction);
  },

  downloadSubscrExcel: async (
    { order, asc, start_dt, end_dt },
    loadingFunction = () => {}
  ) => {
    var apiName = v1Api;
    var path = '/cms/subscr-list';
    var init = {
      queryStringParameters: {
        order,
        asc,
        start_dt,
        end_dt,
        excel_download: true,
      },
    };
    return Api.get(apiName, path, init, loadingFunction);
  },
  getSubscrDetail: async ({ sys_subscr_no }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = `/cms/subscr/${sys_subscr_no}`;
    var init = {
      queryStringParameters: {
        sys_subscr_no,
      },
    };
    return await Api.get(apiName, path, init, loadingFunction);
  },

  getNoticeList: async (
    {
      page,
      limit = 10,
      order = 'reg',
      asc = false,
      show_only = false,
      start_dt,
      end_dt,
      excel_download = false,
    },
    loadingFunction = () => {}
  ) => {
    var apiName = v1Api;
    var path = `/cms/notice-list`;
    var init = {
      queryStringParameters: {
        page,
        limit,
        order,
        asc,
        show_only,
        start_dt,
        end_dt,
        excel_download,
      },
    };
    return await Api.get(apiName, path, init, loadingFunction);
  },
  downloadNoticeExcel: async (
    { order = 'reg', asc = false, show_only = false, start_dt, end_dt },
    loadingFunction = () => {}
  ) => {
    var apiName = v1Api;
    var path = '/cms/notice-list';
    var init = {
      queryStringParameters: {
        order,
        asc,
        show_only,
        start_dt,
        end_dt,
        excel_download: true,
      },
    };
    return Api.get(apiName, path, init, loadingFunction);
  },

  getIndividualSetup: async (loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = `/cms/setup-info`;
    var init = {
      queryStringParameters: {},
    };
    return await Api.get(apiName, path, init, loadingFunction);
  },

  setIndividualSetup: async ({
    tel_list,
  }) => {
    var apiName = v1Api;
    var path = `/cms/setup-info`;
    var init = {
      body: {
        tel_list : utils.filterOnlyDigit(tel_list)
      },
    };
    console.log('tel_list',init)

    return Api.put(apiName, path, init);
  },
  getIndividualNotice: async ({ notice_no }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = `/cms/notice/${notice_no}`;
    var init = {
      queryStringParameters: {},
    };
    return await Api.get(apiName, path, init, loadingFunction);
  },

  setIndividualNotice: async ({
    notice_no,
    title,
    content,
    show_yn,
    file = null,
    img_url_adres,
    recv_type
  }) => {
    var apiName = v1Api;
    var path = `/cms/notice/${notice_no}`;
    var init = {
      body: {
        notice_no,
        title,
        content,
        show_yn,
        img_url_adres,
        recv_type
      },
    };
    if (file) {
      const file_name = uuidv4();
      const file_extension = file.name
        .substring(file.name.lastIndexOf('.'), file.name.length)
        .toLowerCase();
      const key = `notice/${file_name}${file_extension}`;
      try {
        var data = await Storage.put({
          key,
          object: file,
          config: {
            contentType: 'image/png',
            level: 'public',
          },
        });
        init.body.img_url_adres = `public/${data.key}`;
      } catch (error) {
        console.error(error);
        return error;
      }
    }
    return Api.put(apiName, path, init);
  },
  createNewNotice: async ({
    title,
    content,
    show_yn,
    file = null,
    recv_type,
    img_url_adres,
  }) => {
    var apiName = v1Api;
    var path = `/cms/notice`;
    var init = {
      body: {
        title,
        content,
        show_yn,
        img_url_adres,
        recv_type
      },
    };
    if (file) {
      const file_name = uuidv4();
      const file_extension = file.name
        .substring(file.name.lastIndexOf('.'), file.name.length)
        .toLowerCase();
      const key = `notice/${file_name}${file_extension}`;
      try {
        var data = await Storage.put({
          key,
          object: file,
          config: {
            contentType: 'image/png',
            level: 'public',
          },
        });
        init.body.img_url_adres = `public/${data.key}`;
      } catch (error) {
        console.error(error);
        return error;
      }
    }
    return Api.post(apiName, path, init);
  },

  deleteNotice: async ({ notice_no }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = `/cms/notice/${notice_no}`;
    var init = {
      queryStringParameters: {},
    };
    return await Api.del(apiName, path, init, loadingFunction);
  },

  sendPushNotice: async ({ notice_no,target_group }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = `/cms/notice/pushsend/${notice_no}`;
    var init = {
      queryStringParameters: {
        target_group
      },
    };
    return await Api.get(apiName, path, init, loadingFunction);
  },

  getToS: async (loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = `/cms/tos`;
    var init = {
      queryStringParameters: {},
    };
    return await Api.get(apiName, path, init, loadingFunction);
  },

  setToS: async ({ tos }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = `/cms/tos`;
    var init = {
      body: {
        tos,
      },
    };
    return await Api.post(apiName, path, init, loadingFunction);
  },

  getPrivacyPolicy: async (loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = `/cms/privacy-policy`;
    var init = {
      queryStringParameters: {},
    };
    return await Api.get(apiName, path, init, loadingFunction);
  },
  setPrivacyPolicy: async ({ privacy_policy }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = `/cms/privacy-policy`;
    var init = {
      body: {
        privacy_policy,
      },
    };
    return await Api.post(apiName, path, init, loadingFunction);
  },
};
