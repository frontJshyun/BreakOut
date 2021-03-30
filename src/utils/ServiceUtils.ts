export default {
  getAxiosConfig() {
    return {
      baseURL: `https://api.makeyourownimage.com/`,
      crossdomain: true,
      timeout: 60000
    };
  }
}