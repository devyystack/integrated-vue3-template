import axios from 'axios'
import setting from '../setting'
function apiCall(url, method, data, successCallback, errorCallback){
    axios({
        method: method,
        url: url,
        data: data,
        headers: {},
        baseURL: setting.url
    })
    .then(successCallback)
    .catch(errorCallback)
}
export default apiCall