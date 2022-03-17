import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import DashboardTypeLayout from 'layout/DashboardTypeLayout';
import { InquiryDetailPage, InquiryListPage } from 'pages/InquiryPage';
import { SubscrDetailPage, SubscrListPage } from 'pages/SubscrPage';
import { PrivacyPage, TermsOfServicePage } from 'pages/PolicyPage';
import SetLoginImagePage from 'pages/SetLoginImagePage';
import { UserListPage, UserDetailPage } from 'pages/UsersPage';
import {NoticeListPage,NoticeDetailPage,NoticeCreatePage} from 'pages/NoticePage';
import {SetupPage} from 'pages/SetupPage';
import Feedback from 'components/Feedback';
import { useQueryClient } from 'react-query';
import { RecoilRoot } from "recoil";

export default function DashboardRoutes() {
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const queryClient = useQueryClient();
    useEffect(() => {
        if (queryClient.getQueryData(['feedback-msg'])) {
            setFeedbackOpen(true);
        }
        return () => {
            setTimeout(() => {
                queryClient.setQueryData(['feedback-msg'], '');
            }, 5000);
        };
    }, [
        queryClient.getQueryData(['feedback-msg']),
        queryClient.getQueryData(['feedback-severity']),
    ]);
    
    return (
        <RecoilRoot>
            <Switch>
                <DashboardTypeLayout>
                    <Feedback open={feedbackOpen} setOpen={setFeedbackOpen} />

                    <Route path="/pr/set-login-image" component={SetLoginImagePage} />
                    <Route exact path="/pr/users" component={UserListPage} />
                    <Route exact path="/pr/setup" component={SetupPage} />
                    <Route path="/pr/users/:userId/:userType" component={UserDetailPage} />
                    <Route exact path="/pr/inquiry" component={InquiryListPage} />
                    <Route path="/pr/inquiry/:inquiryId" component={InquiryDetailPage} />
                    <Route exact path="/pr/notice" component={NoticeListPage} />
                    <Route exact path="/pr/notice/create" component={NoticeCreatePage} />
                    <Route exact path="/pr/notice/detail/:noticeId" component={NoticeDetailPage} />

                    <Route exact path="/pr/subscr" component={SubscrListPage} />
                    <Route path="/pr/subscr/:subscrId" component={SubscrDetailPage} />

                    {/* policy */}
                    <Route path="/pr/policy/terms-of-service" component={TermsOfServicePage} />
                    <Route path="/pr/policy/privacy" component={PrivacyPage} />
                </DashboardTypeLayout>
            </Switch>
        </RecoilRoot>
    );
}
