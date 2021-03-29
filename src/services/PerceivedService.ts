
import axios from 'axios';
import ServiceUtils from '../utils/ServiceUtils';

async function postPerceived(params: { userName: string, description: string }) {
  return await axios.post('/perceived', params, ServiceUtils.getAxiosConfig());
}

async function getPerceived() {
  return await axios.get('/perceived', { ...ServiceUtils.getAxiosConfig() })
}

async function deletePerceived(params: { id: string }) {
  return await axios.delete(`/perceived/${params.id}`, { ...ServiceUtils.getAxiosConfig() })
} 

export default {
  postPerceived,
  getPerceived,
  deletePerceived
}