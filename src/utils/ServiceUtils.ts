export default {
  getAxiosConfig() {
    return {
      baseURL: `http://52.78.44.119:4000/`,
      crossdomain: true,
      timeout: 60000
    };
  }
}