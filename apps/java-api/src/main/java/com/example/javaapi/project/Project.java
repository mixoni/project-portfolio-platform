package com.example.javaapi.project;

public record Project(
        long id,
        String name,
        String status,
        String owner,
        String riskLevel,
        Double budget
) {}
