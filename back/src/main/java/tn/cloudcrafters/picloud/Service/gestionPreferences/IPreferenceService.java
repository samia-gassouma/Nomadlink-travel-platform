package tn.cloudcrafters.picloud.Service.gestionPreferences;



import tn.cloudcrafters.picloud.Entity.gestionPreferences.Preference;

import java.util.List;

public interface IPreferenceService {
    Preference addPreference(Preference preference);
//    Preference updatePreference(Preference preference);
    Preference updatePreference(Long id, Preference preferenceDetails);

    Preference getPreferenceById(Long id);
    List<Preference> getAllPreferences();
    void deletePreference(Long id);
}
