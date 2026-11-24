package tn.cloudcrafters.picloud.Entity.gestionUser;



import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import tn.cloudcrafters.picloud.Entity.*;
import tn.cloudcrafters.picloud.Entity.gestionPack.Paiement;
import tn.cloudcrafters.picloud.Entity.gestionPack.RewardPoints;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Commande;
import tn.cloudcrafters.picloud.Entity.gestioncommunity.*;
import tn.cloudcrafters.picloud.SecurityAll.tokens.Token;
import tn.cloudcrafters.picloud.Entity.gestionPreferences.Preference;
import tn.cloudcrafters.picloud.Entity.gestionServices.Services;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;


@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // Héritage sur une seule table
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING) // Colonne discriminante
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EntityListeners(AuditingEntityListener.class)

public class User implements UserDetails, Principal {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id; // Identifiant unique

    //@Column(nullable = false)
    private String firstName;
    //@Column(nullable = false)
    private String lastName;
    //   @Column(unique = true, nullable = false)
    @Column(unique = true)
    private String email; // Email unique
    //@Column(nullable = false)
    private String password;
    //@Column(nullable = false, unique = true)
    private String phoneNumber;
    private String address;
    private String country;

    private boolean accountLocked;
    private boolean enabled;

    @Enumerated(EnumType.STRING)
    //@Column(nullable = false)
    private ERole role; // ADMIN, USER, PARTNER

    @ManyToMany(mappedBy = "users")
    @JsonIgnore
    private List<Role> roles;



    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING) // Utilisation de EnumType.STRING pour stocker sous forme de chaîne
    private Genre genre; // Changer ici pour utiliser l'enum Genre
    private String profilePicture; // Lien vers l'image de profil



    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(insertable = false)
    private LocalDateTime lastModifiedDate;

    private boolean hasSelectedPreferences = false; // Indique si l'utilisateur a choisi ses préférences



    @ManyToMany(mappedBy = "users", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Services> selectedServices; // Services choisis par l'utilisateur

    //    @ManyToMany(mappedBy = "users",cascade = CascadeType.ALL)
    @ManyToMany
    @JsonIgnore
    private List<Preference> preferences;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Token> tokens;







    //////////Security
    @Override
    public String getName() {
        return email;
    }
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        //return UserDetails.super.isAccountNonExpired();
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        //return UserDetails.super.isAccountNonLocked();
        return !accountLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        //return UserDetails.super.isCredentialsNonExpired();
        return true;
    }

    @Override
    public boolean isEnabled() {
        //return UserDetails.super.isEnabled();
        return enabled;
    }

    public String fullName() {
        return getFirstname() + " " + getLastname();
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }
/////////////////




    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstName;
    }

    public void setFirstname(String firstName) {
        this.firstName = firstName;
    }

    public String getLastname() {
        return lastName;
    }

    public void setLastname(String lastName) {
        this.lastName = lastName;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        //return null;
        if (this.role == null) {
            return List.of(); // Retourner une liste vide au lieu d'un NullPointerException
        }
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.role.name()));

    }



    //Oussema
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Post> posts = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
    private List<Message> sentMessages = new ArrayList<>();

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL)
    private List<Message> receivedMessages = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "group_members",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "group_id")
    )
    private Set<Group> groups = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Reaction> reactions = new HashSet<>();

    ///Samia
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private RewardPoints rewardPoints;
    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Paiement> paiements;

    //Sarra

    @OneToMany(mappedBy = "user")
    private List<Commande> commandes;


    //Ranim
    @ManyToMany(mappedBy = "users")
    @JsonIgnore
    private List<Destination> destinations;

    @ManyToMany(mappedBy = "users")
    @JsonIgnore
    private List<Activity> activities;


    @ManyToMany(mappedBy = "users")
    @JsonIgnore
    private List<Event> events;




}