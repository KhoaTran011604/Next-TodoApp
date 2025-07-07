import api from "lib/api"


export const getTodos = () => api.post('/todo/get-all', {})
export const createTodo = (data: any) => api.post('/todo/create', data)
