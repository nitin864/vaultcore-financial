package com.zaalima.vaultcore.security;
import com.auth0.jwt.algorithms.Algorithm;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

public class CustomAuthorizationFIlter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
       if(request.getServletPath().equals("/api/login")){
           filterChain.doFilter(request,response);
       }else {
           String authorizationheaders = request.getHeader(AUTHORIZATION);
           if (authorizationheaders != null && authorizationheaders.startsWith("Bearer "));
           String token = authorizationheaders.substring("Bearer ".length());
           Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());
       }
    }
}
