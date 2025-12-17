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
        const response = await axios.post(ApiPaths.postReserve, { params: body });

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

export async function fetchPostInterfaceService(body) {
    try {
        const response = await axios.post(ApiPaths.postInterface, { params: body });

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
        const response = await axios.get(ApiPaths.getProvince);
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