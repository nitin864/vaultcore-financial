package com.zaalima.vaultcore.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ManyToAny;

import java.util.ArrayList;
import java.util.Collection;

@Entity @Data
public class User {
    @Id @GeneratedValue(strategy =  GenerationType.AUTO)
    private Long id;
    private String name;
    private String username;
    private String password;
    @ManyToAny(fetch =  FetchType.EAGER)
    private Collection<Role> roles = new ArrayList<>();
}
