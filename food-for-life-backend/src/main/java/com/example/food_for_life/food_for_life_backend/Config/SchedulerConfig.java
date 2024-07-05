package com.example.food_for_life.food_for_life_backend.Config;

import com.example.food_for_life.food_for_life_backend.Service.AlimentoService;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
public class SchedulerConfig {

    private final AlimentoService alimentoService;

    public SchedulerConfig(AlimentoService alimentoService) {
        this.alimentoService = alimentoService;
    }

    @Scheduled(cron = "0 0 * * * ?")
    public void deleteOldFoodEntries() {
        alimentoService.eliminarRegistrosAntiguos();
    }
}
