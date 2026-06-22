package com.ignitionmotors.api.dtos;

import com.ignitionmotors.api.models.User;
import com.ignitionmotors.api.models.UserRole;

public record LoginResponseDTO(
        String token,
        Long id,
        String name,
        String email,
        UserRole role
) {
    public LoginResponseDTO(String token, User user) {
        this(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
