package com.ignitionmotors.api.dtos;

import java.math.BigDecimal;
import java.util.List;

public record CarRequestDTO(
        String brand,
        String model,
        Integer year,
        BigDecimal price,
        Integer km,
        String engine,
        Integer horsepower,
        Double zeroToHundred,
        List<String> imageUrls
) {
}