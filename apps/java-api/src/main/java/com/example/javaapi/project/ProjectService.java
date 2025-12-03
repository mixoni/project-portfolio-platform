package com.example.javaapi.project;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final List<Project> projects = List.of(
            new Project(1, "Core Platform Migration", "IN_PROGRESS", "admin", "HIGH", 120_000.0),
            new Project(2, "Design System Evolution", "PLANNED", "designer", "MEDIUM", 80_000.0),
            new Project(3, "Reporting Dashboard", "COMPLETED", "analyst", "LOW", 45_000.0)
    );

    public List<Project> getAll() {
        return projects;
    }

    public Project getById(long id) {
        return projects.stream()
                .filter(p -> p.id() == id)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }
}
