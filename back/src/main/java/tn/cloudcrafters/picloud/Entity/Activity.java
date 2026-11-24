package tn.cloudcrafters.picloud.Entity;
import com.fasterxml.jackson.annotation.JsonIgnore;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import tn.cloudcrafters.picloud.Entity.gestionPack.PackAssociation;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;

import java.util.List;
import java.util.Set;


@Entity
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "destination_id")
    @JsonIgnoreProperties("activities") // Pour éviter la récursion infinie
    private Destination destination;
    private String mainImageFilename;

    @ManyToMany
    private List<User> users;

    @ManyToMany(mappedBy = "activities",cascade = CascadeType.REMOVE)
    @JsonIgnore
    private Set<PackAssociation> packAssociations;



    private String activityName;
    private String activityDescription;
    private String activityType;
    private String activityLocation;
    private String priceType;
    private String priceRange;
    private String bookingRequired;
    private String duration;
    private String difficultyLevel;
    private String requiredEquipment;
    private String safetyTips;

    @ElementCollection
    private List<String> accessibility;

    @ElementCollection
    private List<String> languages;

    @ElementCollection
    private List<String> galleryImages;

    public String getMainImage() {
        return mainImage;
    }

    public String getMainImageFilename() {
        return mainImageFilename;
    }

    public Destination getDestination() {
        return destination;
    }

    public void setMainImage(String mainImage) {
        this.mainImage = mainImage;
    }

    public void setMainImageFilename(String mainImageFilename) {
        this.mainImageFilename = mainImageFilename;
    }

    public void setDestination(Destination destination) {
        this.destination = destination;
    }

    private String mainImage;
    // Assuming the main image will be stored as a byte array

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }



    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public String getActivityDescription() {
        return activityDescription;
    }

    public void setActivityDescription(String activityDescription) {
        this.activityDescription = activityDescription;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getActivityLocation() {
        return activityLocation;
    }

    public void setActivityLocation(String activityLocation) {
        this.activityLocation = activityLocation;
    }

    public String getPriceType() {
        return priceType;
    }

    public void setPriceType(String priceType) {
        this.priceType = priceType;
    }

    public String getPriceRange() {
        return priceRange;
    }

    public void setPriceRange(String priceRange) {
        this.priceRange = priceRange;
    }

    public String getBookingRequired() {
        return bookingRequired;
    }

    public void setBookingRequired(String bookingRequired) {
        this.bookingRequired = bookingRequired;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public String getRequiredEquipment() {
        return requiredEquipment;
    }

    public void setRequiredEquipment(String requiredEquipment) {
        this.requiredEquipment = requiredEquipment;
    }

    public String getSafetyTips() {
        return safetyTips;
    }

    public void setSafetyTips(String safetyTips) {
        this.safetyTips = safetyTips;
    }

    public List<String> getAccessibility() {
        return accessibility;
    }

    public void setAccessibility(List<String> accessibility) {
        this.accessibility = accessibility;
    }

    public List<String> getLanguages() {
        return languages;
    }

    public void setLanguages(List<String> languages) {
        this.languages = languages;
    }

    public List<String> getGalleryImages() {
        return galleryImages;
    }

    public void setGalleryImages(List<String> galleryImages) {
        this.galleryImages = galleryImages;
    }


}
