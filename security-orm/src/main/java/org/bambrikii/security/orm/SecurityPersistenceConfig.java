package org.bambrikii.security.orm;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EntityScan(basePackageClasses = {
        User.class
})
@EnableJpaRepositories(basePackageClasses = {UserRepository.class})
public class SecurityPersistenceConfig {
}
