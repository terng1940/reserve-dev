import { GetReserveApiStore } from './GetReserveApiStore/GetReserveApiStore';
import { PostReserveApiStore } from './PostReserveApiStore/PostReserveApiStore';
import { GetProvinceApiStore } from './GetProvinceApiStore/GetProvinceApiStore';
import { SendOTPApiStore } from './SendOTPApiStore/SendOTPApiStore';
import { VerifyOTPApiStore } from './VerifyOTPApiStore/VerifyOTPApiStore';

export const rootStore = {
    getReserveApiStore: new GetReserveApiStore(),
    postReserveApiStore: new PostReserveApiStore(),
    getProvinceApiStore: new GetProvinceApiStore(),
    sendOTPApiStore: new SendOTPApiStore(),
    verifyOTPApiStore: new VerifyOTPApiStore()
};
