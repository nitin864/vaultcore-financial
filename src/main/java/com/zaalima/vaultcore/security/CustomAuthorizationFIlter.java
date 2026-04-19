package com.zaalima.vaultcore.security;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import static java.util.Arrays.stream;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.FORBIDDEN;

@Slf4j
public class CustomAuthorizationFIlter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
       if(request.getServletPath().equals("/api/login")){
           filterChain.doFilter(request,response);
       }else {
           String authorizationheaders = request.getHeader(AUTHORIZATION);
           if (authorizationheaders != null && authorizationheaders.startsWith("Bearer ")){
           try {

               String token = authorizationheaders.substring("Bearer ".length());
               Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());
               JWTVerifier verifier = JWT.require(algorithm).build();
               DecodedJWT decodedJWT = verifier.verify(token);
               String username = decodedJWT.getSubject();
               String[] roles = decodedJWT.getClaim("roles").asArray(String.class );
               Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
               stream(roles).forEach(role -> {
                   authorities.add(new SimpleGrantedAuthority(role));
               });
               UsernamePasswordAuthenticationToken authenticationToken =
                       new UsernamePasswordAuthenticationToken(username, null , authorities);
               SecurityContextHolder.getContext().setAuthentication(authenticationToken);
               filterChain.doFilter(request, response);
           }catch (Exception exception){
              log.info("Error logging in : {}", exception.getMessage());
              response.setHeader("error", exception.getMessage());
              response.sendError(FORBIDDEN.value());
           }

       }else {
            filterChain.doFilter(request, response);

        }
    }
}
}
