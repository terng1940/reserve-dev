import { GetReserveApiStore } from './GetReserveApiStore/GetReserveApiStore';
import { PostReserveApiStore } from './PostReserveApiStore/PostReserveApiStore';
import { GetProvinceApiStore } from './GetProvinceApiStore/GetProvinceApiStore';
import { SendOTPApiStore } from './SendOTPApiStore/SendOTPApiStore';
import { VerifyOTPApiStore } from './VerifyOTPApiStore/VerifyOTPApiStore';
import { InformationApiStore } from './InformationApiStore/InformationApiStore';
import { PaymentDetailApiStore } from './PaymentDetailApiStore/PaymentDetailApiStore';
import { QRstatusApiStore } from './QRstatusApiStore/QRstatusApiStore';
import { ReserveDetailApiStore } from './ReserveDetailApiStore/ReserveDetailApiStore';

export const rootStore = {
    getReserveApiStore: new GetReserveApiStore(),
    postReserveApiStore: new PostReserveApiStore(),
    getProvinceApiStore: new GetProvinceApiStore(),
    sendOTPApiStore: new SendOTPApiStore(),
    verifyOTPApiStore: new VerifyOTPApiStore(),
    informationApiStore: new InformationApiStore(),
    paymentDetailApiStore: new PaymentDetailApiStore(),
    qrStatusApiStore: new QRstatusApiStore(),
    reserveDetailApiStore: new ReserveDetailApiStore()
};
