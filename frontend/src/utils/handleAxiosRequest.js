export const handleAxiosRequest = async (response, onSuccess, onFailure) => {
    try {
        // Check if the response contains data
        if (response?.data) {
            onSuccess(response.data);
        }
    } catch (error) {
        if (error?.response?.status === 401) {
            localStorage.clear();
            navigate('/login'); // Handle unauthorized access
            return;
        }

        // Handle failure callback
        if (onFailure) {
            onFailure(error);
        }
        // basically if you put a callback in the third parameter, it will pass the error params in handleAxiosRequest to the callback to perform
    }
};