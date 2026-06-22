package com.ignitionmotors.api.dtos;

import com.ignitionmotors.api.models.Car;
import java.math.BigDecimal;
import java.util.List;

public record CarResponseDTO(
        Long id,
        String brand,
        String model,
        Integer year,
        BigDecimal price,
        String engine,
        Integer horsepower,
        Integer km,
        Double zeroToHundred,
        List<String> imageUrls,
        Long sellerId,
        String sellerName,
        boolean ownedByCurrentUser
) {

    public CarResponseDTO(Car car) {
        this(car, null);
    }

    public CarResponseDTO(Car car, Long currentUserId) {
        this(
                car.getId(),
                car.getBrand(),
                car.getModel(),
                car.getYear(),
                car.getPrice(),
                car.getEngine(),
                car.getHorsepower(),
                car.getKm(),
                car.getZeroToHundred(),
                car.getImageUrls(),
                car.getSeller().getId(),
                car.getSeller().getName(),
                currentUserId != null && currentUserId.equals(car.getSeller().getId())
        );
    }
}
