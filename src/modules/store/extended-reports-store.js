import { createStore, createEffect } from 'effector';
import { apiInvoker } from '../api/api-axios';

export const getOldExtendReports = createEffect(async ({companyId, memberId, currentDate}) => {
    const resp = await apiInvoker.weeklyReport.getOld(companyId,memberId,  currentDate);
    return resp.data;
});

export const extendReports = createStore([]);
extendReports.on(getOldExtendReports.doneData, (_, data) => {
    return data;
});