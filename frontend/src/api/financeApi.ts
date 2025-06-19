import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getNetWorth = (year: number, month: number) =>
  api.get(`/networth?year=${year}&month=${month}`);

export const saveNetWorth = (data: any) => api.post('/networth', data);

export const getAssets = (year: number, month: number) =>
  api.get(`/assets?year=${year}&month=${month}`);

export const saveAsset = (data: any) => api.post('/assets', data);

export const deleteAsset = (id: number) => api.delete(`/assets/${id}`);

export const getLiabilities = (year: number, month: number) =>
  api.get(`/liabilities?year=${year}&month=${month}`);

export const saveLiability = (data: any) => api.post('/liabilities', data);

export const deleteLiability = (id: number) => api.delete(`/liabilities/${id}`);

export const getNetWorthHistory = () => api.get('/networth/history');

export const getNetWorthHistoryInRange = (
  startYear: number,
  startMonth: number,
  endYear: number,
  endMonth: number
) =>
  api.get(
    `/networth/history?startYear=${startYear}&startMonth=${startMonth}&endYear=${endYear}&endMonth=${endMonth}`
  );

export default api;
