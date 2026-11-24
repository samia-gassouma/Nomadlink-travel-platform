package tn.cloudcrafters.picloud.Repository.gestionPreferences;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.cloudcrafters.picloud.Entity.gestionPreferences.Preference;
import tn.cloudcrafters.picloud.Entity.gestionPreferences.PreferenceCategory;

import java.util.List;

@Repository
public interface PreferenceRepository extends JpaRepository<Preference, Long> {
    List<Preference> findByCategory(PreferenceCategory category);

}
