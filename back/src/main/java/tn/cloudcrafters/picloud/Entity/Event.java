package tn.cloudcrafters.picloud.Entity;

import jakarta.persistence.*;
import lombok.*;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_event;
    private String title;
    private String type;
    private String description;

    private String startDateTime;  // Change to String
    private String endDateTime;    // Change to String
    private String location;
    private String duration;
    private String language;

    @ManyToMany
    private List<User> users;

    public void setSchedule(String schedule) {
        this.schedule = schedule;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setRegistrationFee(String registrationFee) {
        this.registrationFee = registrationFee;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public void setLocation(String location) {
        this.location = location;
    }



    public void setType(String type) {
        this.type = type;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setId_event(Long id_event) {
        this.id_event = id_event;
    }

    private String schedule;

    public String getRegistrationFee() {
        return registrationFee;
    }

    public String getTitle() {
        return title;
    }

    public Long getId_event() {
        return id_event;
    }

    public String getType() {
        return type;
    }



    public String getLocation() {
        return location;
    }

    public String getLanguage() {
        return language;
    }

    public String getDuration() {
        return duration;
    }

    public String getSchedule() {
        return schedule;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    private String registrationFee;
    private String imageUrl;
}
