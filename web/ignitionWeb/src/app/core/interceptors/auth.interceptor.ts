import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Pega o token que o AuthController do Java nos deu no login
  const token = localStorage.getItem('jwt_token');

  if (token) {
    // Clona a requisição original e adiciona o cabeçalho de Autorização
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq); // Envia a requisição com o crachá
  }

  return next(req); // Se não tiver token (ex: tela de login), envia normal
};