package com.ignitionmotors.api.dtos;

import com.ignitionmotors.api.models.User;
import com.ignitionmotors.api.models.UserRole;

public record UserProfileDTO(
        Long id,
        String name,
        String email,
        UserRole role
) {
    public UserProfileDTO(User user) {
        this(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
