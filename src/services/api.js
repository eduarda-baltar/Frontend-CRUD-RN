// src/services/api.js
import axios from "axios";

const api = axios.create({
  // Se estiver no navegador do PC:
  baseURL: "http://localhost:3333", 

  // OU se estiver no celular Android físico:
  baseURL: "http://SEU_IP_LOCAL:3333",
});

export { api };