export default {
  getAxiosConfig() {
    return {
      baseURL: `http://localhost:4000/`,
      crossdomain: true,
      timeout: 60000
    };
  }
}