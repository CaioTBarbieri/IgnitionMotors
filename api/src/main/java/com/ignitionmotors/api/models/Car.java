package com.ignitionmotors.api.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Table(name = "cars")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String brand; // Marca (ex: Porsche, Honda)

    @Column(nullable = false)
    private String model; // Modelo (ex: 911 Turbo S, Civic Type R)

    @Column(name = "manufacture_year", nullable = false)
    private Integer year; // Ano

    @Column(nullable = false)
    private BigDecimal price; // Preço do veículo

    @Column(nullable = false)
    private Integer km;

    // Especificações Técnicas e de Performance
    private String engine; // Motor (ex: 3.0 Flat-6 Twin-Turbo, 2.0 i-VTEC)

    private Integer horsepower; // Cavalaria (cv)

    @ElementCollection
    @CollectionTable(name = "car_images", joinColumns = @JoinColumn(name = "car_id"))
    @Column(name = "image_url", columnDefinition = "TEXT")
    @Lob
    private List<String> imageUrls = new java.util.ArrayList<>(); // Nova lista de imagens


    @Column(name = "zero_to_hundred")
    private Double zeroToHundred; // Aceleração 0-100 km/h (s)

    // Relacionamento: Qual usuário cadastrou este carro para venda?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;
}
