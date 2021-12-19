// 사용자관리 > 리스트
export const UserTable = [
  {
    value: '번호',
    key: 'num',
    type: 'string',
    width: '80px',
  },
  {
    value: '이름',
    key: 'user_nm',
    type: 'string',
    width: '160px',
  },
  {
    value: '구분',
    key: 'user_type_text',
    type: 'string',
    width: '160px',
  },
  {
    value: '회사',
    key: 'company_nm',
    type: 'string',
  },
  {
    value: '직책',
    key: 'position',
    type: 'string',
    width: '80px',
  },
  {
    value: '가입일자',
    key: 'reg_dt_excel',
    type: 'string',
  },
  {
    value: '구독',
    key: 'subscript_type',
    type: 'string',
  },
  {
    value: '활동여부',
    key: 'active_text',
    type: 'string',
  },
  {
    value: '만료일',
    key: 'expire_dt_excel',
    type: 'string',
  },
  {
    value: '총구독비',
    key: 'amount_excel',
    type: 'amount',
  },
  {
    value: '로고이미지',
    key: 'logo_img_url',
    type: 'logo_img',
  },
];

// 오름 true, 내림 false, 컬럼명
export const SORTING_OPTIONS = [
  {
    value: 0,
    label: '-',
  },
  {
    value: true,
    label: '오름차순',
  },
  {
    value: false,
    label: '내림차순',
  },
];

// 사용자관리 > 상세페이지
export const USER_DETAIL_TABLE = [
  {
    rows: [
      {
        key: 'user_no',
        label: '번호',
        type: 'string',
      },
      {
        key: 'user_nm',
        label: '이름',
        type: 'string',
      },
    ],
  },
  {
    rows: [
      {
        key: 'user_type',
        label: '구분',
        type: 'string',
      },
      {
        key: 'company_nm',
        label: '회사',
        type: 'string',
      },
    ],
  },
  {
    rows: [
      {
        key: 'position',
        label: '직책',
        type: 'string',
      },
      {
        key: 'reg_dt',
        label: '가입일자',
        type: 'date',
      },
    ],
  },
  {
    rows: [
      {
        key: 'subscript_type',
        label: '구독',
        type: 'string',
      },
      {
        key: 'active_text',
        label: '활동여부',
        type: 'string',
      },
    ],
  },
  {
    rows: [
      {
        key: 'expire_dt',
        label: '만료일',
        type: 'date',
      },
      {
        key: 'amount',
        label: '총 구독비',
        type: 'price',
      },
    ],
  },
  {
    rows: [
      {
        key: 'user_color_form',
        label: '테마칼라',
        type: 'string',
      }      
    ],
  },
  {
    colspan: 3,
    rows: [
      {
        key: 'logo_img_url',
        label: '로고 이미지',
        type: 'img',
      },
    ],
  },
  {
    colspan: 3,
    height: '100px',
    rows: [
      {
        key: 'preview',
        label: '미리보기',
        type: 'preview',
      },
    ],
  },
];

// 사용자관리 > 상세페이지
export const USER_DETAIL_TABLE_STYLIST = [
  {
    rows: [
      {
        key: 'user_no',
        label: '번호',
        type: 'string',
      },
      {
        key: 'user_nm',
        label: '이름',
        type: 'string',
      },
    ],
  },
  {
    rows: [
      {
        key: 'user_type',
        label: '구분',
        type: 'string',
      },
      {
        key: 'company_nm',
        label: '회사',
        type: 'string',
      },
    ],
  },
  {
    rows: [
      {
        key: 'position',
        label: '직책',
        type: 'string',
      },
      {
        key: 'reg_dt',
        label: '가입일자',
        type: 'date',
      },
    ],
  },
  {
    rows: [
      {
        key: 'subscript_type',
        label: '구독',
        type: 'string',
      },
      {
        key: 'active_text',
        label: '활동여부',
        type: 'string',
      },
    ],
  },
  {
    rows: [
      {
        key: 'expire_dt',
        label: '만료일',
        type: 'date',
      },
      {
        key: 'amount',
        label: '총 구독비',
        type: 'price',
      },
    ],
  },
];

// 유저타입 옵션
export const USERTYPE_OPTIONS = [
  {
    value: 0,
    label: '모두선택',
  },
  {
    value: 1,
    label: '브랜드',
  },
  {
    value: 2,
    label: '매거진',
  },
  {
    value: 3,
    label: '스타일리스트',
  },
];

// 직책명 옵션
export const POSITION_OPTIONS = [
  {
    value: 0,
    label: '모두선택',
  },
  {
    value: 1,
    label: '인턴',
  },
  {
    value: 2,
    label: '사원',
  },
  {
    value: 3,
    label: '대리',
  },
  {
    value: 4,
    label: '주임',
  },
  {
    value: 5,
    label: '과장',
  },
  {
    value: 6,
    label: '차장',
  },
  {
    value: 7,
    label: '부장',
  },
  {
    value: 8,
    label: '이사',
  },
  {
    value: 9,
    label: '디렉터',
  },
  {
    value: 10,
    label: '팀장',
  },
  {
    value: 11,
    label: '부편집장',
  },
  {
    value: 12,
    label: '편집장',
  },
  {
    value: 13,
    label: '어시',
  },
  {
    value: 14,
    label: '기자',
  },
  {
    value: 15,
    label: '수석기자',
  },
  {
    value: 16,
    label: '실장',
  },
];

// 활동여부 옵션
export const ACTIVE_OPTIONS = [
  {
    value: 0,
    label: '모두선택',
  },
  {
    value: 1,
    label: 'Active',
  },
  {
    value: 2,
    label: 'Inactive',
  },
];

// 구독여부 옵션
export const SUBSCRIPT_OPTIONS = [
  {
    value: 0,
    label: '모두선택',
  },
  {
    value: 1,
    label: '-',
  },
  {
    value: 2,
    label: 'Monthly',
  },
  {
    value: 3,
    label: 'Free',
  },
  {
    value: 4,
    label: '3 months trial',
  },
];
