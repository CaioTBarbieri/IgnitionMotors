package com.ignitionmotors.api.dtos;

public record ChangePasswordDTO(
        String currentPassword,
        String newPassword,
        String confirmPassword
) {
}
