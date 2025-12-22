import axios from 'utils/axios';
import { CustomException } from 'exceptions/CustomException';
import ApiPaths from 'utils/constants/apiPath';

// ⬇️ this is the loader for the detail route
export async function loader() {
    try {
        const response = await axios.get('/api/products/list');
        return response.data.products;
    } catch (error) {
        return error;
    }
}

export async function filterProducts(filter) {
    return await axios.post('/api/products/filter', { filter });
}

export async function productLoader({ params }) {
    try {
        const response = await axios.post('/api/product/details', { id: params.id });
        return response.data;
    } catch (error) {
        return error;
    }
}

export async function getRelatedProducts(id) {
    return await axios.post('/api/product/related', { id });
}

export async function getProductReviews() {
    return await axios.get('/api/review/list');
}

export async function fetchGetReserveService(body) {
    try {
        const response = await axios.get(ApiPaths.getReserve, { params: body });

        return { response: response.data };
    } catch (err) {
        if (err.response) {
            const { data, status } = err.response;

            return {
                error: new CustomException(data?.message || 'Request failed', {
                    statusCode: status,
                    messageCode: data?.message_code
                })
            };
        }

        return {
            error: new CustomException('Unexpected error: ' + err.message)
        };
    }
}

export async function fetchPostReserveService(body) {
    try {
        const response = await axios.post(ApiPaths.bookReserve, body);

        return { response: response.data };
    } catch (err) {
        if (err.response) {
            const { data, status } = err.response;

            return {
                error: new CustomException(data?.message || 'Request failed', {
                    statusCode: status,
                    messageCode: data?.message_code
                })
            };
        }

        return {
            error: new CustomException('Unexpected error: ' + err.message)
        };
    }
}

export async function fetchInformationService() {
    try {
        const response = await axios.get(ApiPaths.information);

        return { response: response.data };
    } catch (err) {
        if (err.response) {
            const { data, status } = err.response;

            return {
                error: new CustomException(data?.message || 'Request failed', {
                    statusCode: status,
                    messageCode: data?.message_code
                })
            };
        }

        return {
            error: new CustomException('Unexpected error: ' + err.message)
        };
    }
}

export async function fetchPaymentDetailService(body) {
    try {
        const response = await axios.get(ApiPaths.paymentDetail, { params: body });

        return { response: response.data };
    } catch (err) {
        if (err.response) {
            const { data, status } = err.response;

            return {
                error: new CustomException(data?.message || 'Request failed', {
                    statusCode: status,
                    messageCode: data?.message_code
                })
            };
        }

        return {
            error: new CustomException('Unexpected error: ' + err.message)
        };
    }
}

export async function fetchGetProvinceService() {
    try {
        const response = await axios.get('https://api-app-3rd.promptpark.co/api/v1-202402/customer/get-provinces');
        return { response: response.data };
    } catch (err) {
        if (err.response) {
            const { data, status } = err.response;

            return {
                error: new CustomException(data?.message || 'Request failed', {
                    statusCode: status,
                    messageCode: data?.message_code
                })
            };
        }

        return {
            error: new CustomException('Unexpected error: ' + err.message)
        };
    }
}

export async function fetchSendOTPService(body) {
    try {
        const response = await axios.post('https://api-app-3rd.promptpark.co/api/v1-202402/otp/send-otp', body);

        return { response: response.data };
    } catch (err) {
        if (err.response) {
            const { data, status } = err.response;

            return {
                error: new CustomException(data?.message || 'Request failed', {
                    statusCode: status,
                    messageCode: data?.message_code
                })
            };
        }

        return {
            error: new CustomException('Unexpected error: ' + err.message)
        };
    }
}

export async function fetchVerifyOTPService(body) {
    try {
        const response = await axios.post('https://api-app-3rd.promptpark.co/api/v1-202402/otp/verify-otp', body);

        return { response: response.data };
    } catch (err) {
        if (err.response) {
            const { data, status } = err.response;

            return {
                error: new CustomException(data?.message || 'Request failed', {
                    statusCode: status,
                    messageCode: data?.message_code
                })
            };
        }

        return {
            error: new CustomException('Unexpected error: ' + err.message)
        };
    }
}

export async function fetchQRstatusService(body) {
    try {
        const response = await axios.get('https://payment-gw.jparkdev.co/api/v1/payment/qr-status', { params: body });

        return { response: response.data };
    } catch (err) {
        if (err.response) {
            const { data, status } = err.response;

            return {
                error: new CustomException(data?.message || 'Request failed', {
                    statusCode: status,
                    messageCode: data?.message_code
                })
            };
        }

        return {
            error: new CustomException('Unexpected error: ' + err.message)
        };
    }
}

export async function fetchReserveDetailService(body) {
    try {
        const response = await axios.get(ApiPaths.reserveDetail, { params: body });

        return { response: response.data };
    } catch (err) {
        if (err.response) {
            const { data, status } = err.response;

            return {
                error: new CustomException(data?.message || 'Request failed', {
                    statusCode: status,
                    messageCode: data?.message_code
                })
            };
        }

        return {
            error: new CustomException('Unexpected error: ' + err.message)
        };
    }
}