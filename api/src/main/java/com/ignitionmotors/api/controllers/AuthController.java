package com.ignitionmotors.api.controllers;

import com.ignitionmotors.api.dtos.AuthenticationDTO;
import com.ignitionmotors.api.dtos.ChangePasswordDTO;
import com.ignitionmotors.api.dtos.LoginResponseDTO;
import com.ignitionmotors.api.dtos.RegisterDTO;
import com.ignitionmotors.api.dtos.UserProfileDTO;
import com.ignitionmotors.api.models.User;
import com.ignitionmotors.api.repositories.UserRepository;
import com.ignitionmotors.api.services.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository repository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody AuthenticationDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        User user = (User) auth.getPrincipal();
        var token = tokenService.generateToken(user);

        return ResponseEntity.ok(new LoginResponseDTO(token, user));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userEmail = ((UserDetails) principal).getUsername();
        User user = (User) repository.findByEmail(userEmail);

        return ResponseEntity.ok(new UserProfileDTO(user));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO data) {
        User user = getAuthenticatedUser();

        if (isBlank(data.currentPassword()) || isBlank(data.newPassword()) || isBlank(data.confirmPassword())) {
            return ResponseEntity.badRequest().body("Preencha todos os campos.");
        }

        if (!passwordEncoder.matches(data.currentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Senha atual incorreta.");
        }

        if (!data.newPassword().equals(data.confirmPassword())) {
            return ResponseEntity.badRequest().body("A confirmacao da nova senha nao confere.");
        }

        if (data.newPassword().length() < 8) {
            return ResponseEntity.badRequest().body("A nova senha precisa ter pelo menos 8 caracteres.");
        }

        if (passwordEncoder.matches(data.newPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("A nova senha precisa ser diferente da senha atual.");
        }

        user.setPassword(passwordEncoder.encode(data.newPassword()));
        repository.save(user);

        return ResponseEntity.ok("Senha alterada com sucesso.");
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterDTO data) {
        if (this.repository.findByEmail(data.email()) != null) {
            return ResponseEntity.badRequest().build(); // Retorna erro se o e-mail já existir
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        User newUser = new User();
        newUser.setEmail(data.email());
        newUser.setPassword(encryptedPassword);
        newUser.setName(data.name());
        newUser.setRole(data.role());

        this.repository.save(newUser);

        return ResponseEntity.ok().build();
    }

    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userEmail = ((UserDetails) principal).getUsername();
        return (User) repository.findByEmail(userEmail);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
