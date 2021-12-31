import { axiosInstance } from 'boot/axios';

export function fetchStats(context) {
  return axiosInstance.get('/dashboard');
}
