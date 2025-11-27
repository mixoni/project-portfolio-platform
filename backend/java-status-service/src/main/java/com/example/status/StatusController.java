package com.example.status;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class StatusController {

  @GetMapping("/statuses")
  public List<String> getStatuses() {
    return List.of("PLANNED", "IN_PROGRESS", "ON_HOLD", "DONE");
  }
}
