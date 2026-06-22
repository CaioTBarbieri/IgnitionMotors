package com.ignitionmotors.api.controllers;

import com.ignitionmotors.api.dtos.CarRequestDTO;
import com.ignitionmotors.api.dtos.CarResponseDTO;
import com.ignitionmotors.api.models.Car;
import com.ignitionmotors.api.models.User;
import com.ignitionmotors.api.repositories.CarRepository;
import com.ignitionmotors.api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cars")
public class CarController {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<CarResponseDTO> createCar(@RequestBody CarRequestDTO data) {
        User seller = getCurrentUser();

        Car newCar = new Car();
        updateCarData(newCar, data);
        newCar.setSeller(seller);

        carRepository.save(newCar);
        return ResponseEntity.ok(new CarResponseDTO(newCar, seller.getId()));
    }

    @GetMapping
    public ResponseEntity<List<CarResponseDTO>> getAllCars() {
        Long currentUserId = getCurrentUser().getId();
        List<CarResponseDTO> carList = carRepository.findAll().stream()
                .map(car -> new CarResponseDTO(car, currentUserId))
                .toList();
        return ResponseEntity.ok(carList);
    }

    @GetMapping("/mine")
    public ResponseEntity<List<CarResponseDTO>> getMyCars() {
        User currentUser = getCurrentUser();
        List<CarResponseDTO> carList = carRepository.findBySellerId(currentUser.getId()).stream()
                .map(car -> new CarResponseDTO(car, currentUser.getId()))
                .toList();
        return ResponseEntity.ok(carList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarResponseDTO> getCarById(@PathVariable Long id) {
        Long currentUserId = getCurrentUser().getId();
        return carRepository.findById(id)
                .map(car -> ResponseEntity.ok(new CarResponseDTO(car, currentUserId)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarResponseDTO> updateCar(@PathVariable Long id, @RequestBody CarRequestDTO data) {
        User currentUser = getCurrentUser();

        return carRepository.findById(id)
                .map(car -> {
                    if (!car.getSeller().getId().equals(currentUser.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).<CarResponseDTO>build();
                    }

                    updateCarData(car, data);
                    carRepository.save(car);
                    return ResponseEntity.ok(new CarResponseDTO(car, currentUser.getId()));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        User currentUser = getCurrentUser();

        return carRepository.findById(id)
                .map(car -> {
                    if (!car.getSeller().getId().equals(currentUser.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).<Void>build();
                    }

                    carRepository.delete(car);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userEmail = ((UserDetails) principal).getUsername();
        return (User) userRepository.findByEmail(userEmail);
    }

    private void updateCarData(Car car, CarRequestDTO data) {
        car.setBrand(data.brand());
        car.setModel(data.model());
        car.setYear(data.year());
        car.setPrice(data.price());
        car.setEngine(data.engine());
        car.setHorsepower(data.horsepower());
        car.setKm(data.km());
        car.setZeroToHundred(data.zeroToHundred());
        car.setImageUrls(data.imageUrls());
    }
}
