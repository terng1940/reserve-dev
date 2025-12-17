import { GetReserveApiStore } from './GetReserveApiStore/GetReserveApiStore';
import { PostReserveApiStore } from './PostReserveApiStore/PostReserveApiStore';
import { PostInterfaceApiStore } from './PostInterfaceApiStore/PostInterfaceApiStore';
import { GetProvinceApiStore } from './GetProvinceApiStore/GetProvinceApiStore';

export const rootStore = {
    getReserveApiStore: new GetReserveApiStore(),
    postReserveApiStore: new PostReserveApiStore(),
    postInterfaceApiStore: new PostInterfaceApiStore(),
    getProvinceApiStore: new GetProvinceApiStore()
};
