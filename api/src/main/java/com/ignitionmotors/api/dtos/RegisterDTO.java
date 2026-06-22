package com.ignitionmotors.api.dtos;

import com.ignitionmotors.api.models.UserRole;

public record RegisterDTO(String email, String password, String name, UserRole role) {
}