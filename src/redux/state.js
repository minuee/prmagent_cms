import { atom } from "recoil";
export const currentDrawer = atom({
	key: "currentDrawer",
	default: true
});

export const currentPage = atom({
	key: "currentPage",
	default: 1,
	// default: "NOT_SIGN",
});

export const currentPageName = atom({
	key: "currentPageName",
	default: null,
	// default: "NOT_SIGN",
});

//공지사항 필터  start
export const currentNoticeStartDate= atom({
	key: "currentNoticeStartDate",
	default: new Date('2021', 0, 1)
});
export const currentNoticeEndDate= atom({
	key: "currentNoticeEndDate",
	default: new Date()
});
export const currentNoticeSortFilter = atom({
	key: "currentNoticeSortFilter",
	default: 'no'
});
export const currentNoticeSortASC = atom({
	key: "currentNoticeSortASC",
	default: false
});
export const currentNoticeShowOnly = atom({
	key: "currentNoticeShowOnly",
	default: false
});
export const currentNoticeChevronDirection = atom({
	key: "currentNoticeChevronDirection",
	default: false
});
//공지사항 필터 end

//문의사항 필터  start
export const currentInquiryStartDate= atom({
	key: "currentInquiryStartDate",
	default: new Date('2021', 0, 1)
});
export const currentInquiryEndDate= atom({
	key: "currentInquiryEndDate",
	default: new Date()
});
export const currentInquirySortFilter = atom({
	key: "currentInquirySortFilter",
	default: 'no'
});
export const currentInquirySortASC = atom({
	key: "currentInquirySortASC",
	default: false
});
export const currentInquiryShowOnly = atom({
	key: "currentInquiryShowOnly",
	default: false
});
export const currentInquiryChevronDirection = atom({
	key: "currentInquiryChevronDirection",
	default: false
});
//문의사항 필터 end

//구독관리 필터  start
export const currentSubscrStartDate= atom({
	key: "currentSubscrStartDate",
	default: new Date('2021', 0, 1)
});
export const currentSubscrEndDate= atom({
	key: "currentSubscrEndDate",
	default: new Date()
});
export const currentSubscrSortFilter = atom({
	key: "currentSubscrSortFilter",
	default: 'no'
});
export const currentSubscrSortASC = atom({
	key: "currentSubscrSortASC",
	default: false
});
export const currentSubscrShowOnly = atom({
	key: "currentSubscrShowOnly",
	default: false
});
export const currentSubscrChevronDirection = atom({
	key: "currentSubscrChevronDirection",
	default: false
});
//구독관리 필터 end

//유저관리 필터  start
export const currentUserListOpen= atom({
	key: "currentUserListOpen",
	default: {
		num: false,
		user_nm: false,
		user_type_text: false,
		company_nm: false,
		position: false,
		reg_dt_excel: false,
		subscript_type: false,
		active_text: false,
		expire_dt_excel: false,
		amount_excel: false,
	}
});
export const currentUserListChecked= atom({
	key: "currentUserListChecked",
	default: {
		num: [],
		user_nm: [],
		user_type_text: [],
		company_nm: [],
		position: [],    
		start_reg_dt: '',
		end_reg_dt: '',
		subscript_type: [],
		active_text: [],    
		start_expire_dt: '',
		end_expire_dt: '',
		amount_excel: [],
	}
});
export const currentUserListSearch = atom({
	key: "currentUserListSearch",
	default: {
		num: '',
		user_nm: '',
		user_type_text: '',
		company_nm: '',
		position: '',    
		start_reg_dt: '',
		end_reg_dt: '',
		subscript_type: '',
		active_text: '',    
		start_expire_dt: '',
		end_expire_dt: '',
		amount_excel: '',	
	}
});
export const currentUserListFilter = atom({
	key: "currentUserListFilter",
	default: {
		num: false,
		user_nm: false,
		user_type_text: false,
		company_nm: false,
		position: false,
		reg_dt_excel: false,
		subscript_type: false,
		active_text: false,
		expire_dt_excel: false,
		amount_excel: false,	
	}
});

export const currentUserListAlign = atom({
	key: "currentUserListAlign",
	default: {
		order: '',
		asc: true
	}
});
//유저관리 필터 end