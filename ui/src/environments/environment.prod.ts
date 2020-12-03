export const environment = {
  production: true,
};

export const BASE_API_URL = 'https://shortly-295413.ts.r.appspot.com/api';

export const API_CONFIG = {
  getAll: `${BASE_API_URL}/links`,
  getById: `${BASE_API_URL}/links/{id}`,
  update: `${BASE_API_URL}/links/{id}`,
  add: `${BASE_API_URL}/links`,
  delete: `${BASE_API_URL}/links/{id}`,
};
