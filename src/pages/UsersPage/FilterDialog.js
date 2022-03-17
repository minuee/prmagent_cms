import React, { useState,useRef, useCallback, useMemo } from "react";
import {Box,FormControl,OutlinedInput,Typography,DialogTitle,DialogContent,Dialog,DialogActions,Divider} from "@material-ui/core";
import styled, { css } from "styled-components";
import { darken } from "polished";
import dayjs from 'dayjs';
import ReactDatePicker from 'react-datepicker';
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import CancelIcon from "asset/images/close_icon.png";
import CheckIcon from "asset/images/check_icon.png";
import { apiObject } from 'api';
import { useQuery, useMutation } from 'react-query';
import * as utils from "../../utils"



function FindIdDialog({ open, setOpen,setClose, userData }) {
let nowDate = new Date();
const classes = useStyles();
const [startDate, setStartDate] = useState(new Date());
const [endDate, setEndDate] = useState(nowDate.setMonth(nowDate.getMonth() + 1));  
const [price, setPrice] = useState(0);
const priceInputRef = useRef(null);

const registSubscribe = async() => {

	if (confirm('구독을 추가하시겠습니까?')) {
		registSubscrip.mutate({
			subscr_man_id : userData.data.user_id,
			brand_id: userData.data.brand_id,
			start_date: dayjs(startDate).unix(),
			end_date: dayjs(endDate).unix(),
			subscr_se_cd : 'SBS001', //Trial
			subscr_status_cd : 'SBST02', //겳제
			subscr_chrge_amt : priceInputRef.current.value,
		});
	}	
}

	const registSubscrip = useMutation(
		["brand-user-registsubscribe"],
		(value) =>
apiObject.registSubscribe(
{
subscr_man_id: value.subscr_man_id,  
brand_id: value.brand_id,  
start_date: value.start_date,  
end_date: value.end_date,  
subscr_se_cd: value.subscr_se_cd,  
subscr_status_cd: value.subscr_status_cd,
subscr_chrge_amt : value.subscr_chrge_amt
},
() => {}
 ),
{
 onSuccess: () => {
alert('정상적으로 등록되었습니다');
setOpen();
},
onError: () => {
alert("수정 중 오류가 발생했습니다.");
 },
}
);
return (
		<StyleDialog
			onClose={setClose}
			aria-labelledby="simple-dialog-title"
			open={open}
			maxWidth={"lg"}
			className={classes.dialog}
		>
		<DialogTitle id="simple-dialog-title" className={classes.dialogTitle}>
			<TitleWrap>
				<TitleTxt>구독수동 등록</TitleTxt>
			</TitleWrap>
			<CloseIconBox>
				<CloseIcon className={classes.closeIcon} onClick={setClose} />
			</CloseIconBox>
			<DividerWrap>
				<StlyeDivider />
			</DividerWrap>
			</DialogTitle>
				<DialogContent className={classes.dialogContent}>
					<Table>
						<tbody>
							<tr>
								<TitleTd>회사(Brand)</TitleTd>
								<Td>{userData.data.company_nm}</Td>
							</tr>
							<tr>
								<TitleTd>가입일자</TitleTd>
								<Td>{dayjs.unix(userData.data.reg_dt).format('YYYY-MM-DD')}</Td>
							</tr>
							<tr>
								<TitleTd>활동여부</TitleTd>
								<Td>{userData.data.active_text}</Td>
							</tr>
							<tr>
								<TitleTd>구독기간 설정</TitleTd>
								<Td>
									<Box display="flex" alignItems="center">
										<CustomDatePicker
											selected={startDate}
											onChange={(date) => setStartDate(date)}
											selectsStart
											startDate={startDate}
											endDate={endDate}
											minDate={nowDate}
											dateFormat="yyyy-MM-dd"
										/>
										<Box pl={1} pr={1}>
											<Typography>~</Typography>
										</Box>
										<CustomDatePicker
											selected={endDate}
											onChange={(date) => setEndDate(date)}
											selectsEnd
											startDate={startDate}
											endDate={endDate}
											minDate={startDate}
											dateFormat="yyyy-MM-dd"
										/>
									</Box>
								</Td>
							</tr>
							<tr>
								<TitleTd>구독금액</TitleTd>
								<Td>
									<FormControl variant="outlined" fullWidth={true}>
										<OutlinedInput
											id="user_color_form"
											placeholder={'필요할때만 입력하세요'}
											classes={{notchedOutline: classes.textAreaInput,input: classes.zeroPadding}}
											inputRef={priceInputRef}
											defaultValue={price}
										/>
									</FormControl>
								</Td>
							</tr>
						</tbody>
					</Table>
				</DialogContent>
			<DividerWrap>
				<StlyeDivider />
			</DividerWrap>
			<DialogActions>
				<BottomWrap>            
					<BtnWrap type="cancel" onClick={setClose}>
						<BtnImgWrap>
							<img src={CancelIcon} alt="close"/>
						</BtnImgWrap>
						<CancelTxt>Cancel</CancelTxt>
					</BtnWrap>
					<BtnWrap type="confirm" onClick={()=>registSubscribe()}>
						<BtnImgWrap>
							<img src={CheckIcon} alt="check"/>
						</BtnImgWrap>
						<ConfirtTxt>Confirm</ConfirtTxt>
					</BtnWrap>
				</BottomWrap>
			</DialogActions>
		</StyleDialog>
	);
}

const useStyles = makeStyles(() => ({
  dialog: {
    zIndex:9999,
	position:'relative'
  },
  dialogTitle: {
    marginTop: "38px",
    textAlign: "center",
  },
  dialogContent: {
    padding: "0 40px",
    minHeight: "300px",
  },
  closeIcon: {
    fontSize: "24px",
  },
  inputText: {
    height: "0px",
    fontSize: "14px",
  },
  inputBgText: {
    height: "0px",
    fontSize: "14px",
    backgroundColor: "#f6f6f6",
  },
  checkIcon: {
    paddingTop: "5px",
    paddingRight: "5px",
    fontSize: "24px",
    color: "#7ea1b2",
  },
  TextField: {
    width: "340px",
    height: 0,
  },
  textAreaInput: {
	border: 0,
},
zeroPadding: {
	padding: 0,
},
}));



const CustomDatePicker = styled(ReactDatePicker)`
  width:130px;
  height:45px;
  box-sizing:border-box;
  padding:8px;
  border-radius:4px;
  border:1px solid #ccc;
  font-size:15px;
  color:#000000;
`;
const StyleDialog = styled(Dialog)`
  z-indxe:9999;
  align-items: center;
  justify-content: center;
  width: 1000px;
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0);
  }
  .MuiPaper-rounded {
    border-radius: 20px;
  }
  .MuiDialogTitle-root {
    padding: 0;
  }
`;

const Table = styled.table`
  width: 100%;
  margin-top: 14px;
  margin-bottom: 14px;
  border-spacing: 0;
  border-collapse: collapse;
`;

const TitleTd = styled.td`
  width:20%;
  height: 54px;
  background-color: #f1f2ea;
  border-top: solid 1px #c9c9c9;
  border-bottom: solid 1px #c9c9c9;
  font-size: 14px;
  font-weight: bold;
  color: #333333;
  padding: 0 20px;
`;

const Td = styled.td`
  width:80%;
  background-color: #ffffff;
  border-top: solid 1px #c9c9c9;
  border-bottom: solid 1px #c9c9c9;
  font-size: 14px;
  color: #333333;
  padding: 0 20px;
`;

const TitleWrap = styled.div`    
  width:100%;
  height: 54px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleTxt = styled.div`
  font-size: 28px;
  font-weight: 900;
`;

const TitleBtnWrap = styled.div`
  display: flex;
  align-items: center;
  margin-right:50px;
`;

const TitleBtnTxt = styled.div`
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  color: #777777;
  width: ${(props) => props.width || "auto"};

  & + & {
    margin-left: 24px;
  }

  ${(props) =>
    props.active
      ? css`
          color: ${(props) =>
            props.type === "detail" ? "#7ea1b2" : "#000000"};
          &:hover {
            font-weight: bold;
          }
        `
      : css`
          &:hover {
            color: #000000;
          }
        `}}
`;

const CloseIconBox = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

const DividerWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const StlyeDivider = styled(Divider)`
  width: 900px;
  height: 2px;
  background-color: #dddddd;
  margin: 16px 0 24px 0;
`;

const SubMenuWrap = styled.div`
  display: flex;
  padding: 0 40px;
  margin-bottom: 48px;
`;

const SubMenuText = styled.div`
  font-size: 16px;
  color: #777777;
  cursor: pointer;
  width: ${(props) => props.width || "auto"};

  & + & {
    margin-left: 30px;
  }

  &:hover {
    color: #000000;
  }

  ${(props) =>
    props.active &&
    css`
      font-weight: bold;
      color: #000000;
    `}
  ${(props) =>
    props.selected &&
    css`
      color: #7ea1b2;
      &:hover {
        color: ${darken(0.1, "#7ea1b2")};
      }
    `}
`;

const BottomWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 80px 30px 80px; 
`;

const BtnWrap = styled.div`
  width: 160px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) =>
    props.type === "cancel" ? "#ffffff" : "#7ea1b2"};
  border: ${(props) =>
    props.type === "cancel" ? "solid 1px #dddddd" : "none"};
  border-radius: 5px;
  transition: all 0.3s;

  ${(props) =>
    props.type === "cancel" &&
    css`
      &:hover {
        background-color: ${darken(0.1, "#ffffff")};
      }
      &:active {
        background-color: ${darken(0.2, "#ffffff")};
      }
    `}

  ${(props) =>
    props.type === "confirm" &&
    css`
      &:hover {
        background-color: ${darken(0.1, "#7ea1b2")};
      }
      &:active {
        background-color: ${darken(0.2, "#7ea1b2")};
      }
    `} 

  & + & {
    margin-left: 10px;
  }
`;

const BtnImgWrap = styled.div`
  margin-right: 10px;
  display: flex;
`;

const CancelTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #999999;
`;

const ConfirtTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #ffffff;
`;

export default React.memo(FindIdDialog);
