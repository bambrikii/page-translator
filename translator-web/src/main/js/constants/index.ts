const getUrl = window.location;
const baseUrl = getUrl.protocol + "//" + getUrl.host;

export const API_BASE_URL = baseUrl;
export const ACCESS_TOKEN = 'accessToken';

export const OAUTH2_REDIRECT_URI = baseUrl + '/oauth2/redirect'

export const GOOGLE_AUTH_URL = API_BASE_URL + '/oauth2/authorize/google?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const GITHUB_AUTH_URL = API_BASE_URL + '/oauth2/authorize/github?redirect_uri=' + OAUTH2_REDIRECT_URI;
