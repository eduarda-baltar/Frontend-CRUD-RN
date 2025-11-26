// src/services/api.js
import axios from "axios";

const api = axios.create({
  // Se estiver no navegador do PC:
  baseURL: "http://localhost:3333", 

  // OU se estiver no celular Android físico:
  baseURL: "http://192.168.1.12:3333",
});

export { api };