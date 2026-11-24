package tn.cloudcrafters.picloud.SecurityAll.auth;


import tn.cloudcrafters.picloud.Dto_gestionUser.CreateUserDTO;
import tn.cloudcrafters.picloud.Dto_gestionUser.PartnerDTO;
import tn.cloudcrafters.picloud.Dto_gestionUser.PartnerMapper;
import tn.cloudcrafters.picloud.Repository.gestionUser.PartnerRepository;
import tn.cloudcrafters.picloud.SecurityAll.email.EmailService;
import tn.cloudcrafters.picloud.SecurityAll.security.JwtService;
import tn.cloudcrafters.picloud.SecurityAll.tokens.Token;
import tn.cloudcrafters.picloud.SecurityAll.tokens.TokenRepository;
import tn.cloudcrafters.picloud.Entity.gestionUser.*;
import tn.cloudcrafters.picloud.Repository.gestionUser.RoleRepository;
import tn.cloudcrafters.picloud.Repository.gestionUser.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final EmailService emailService;
    private final TokenRepository tokenRepository;
    private final PartnerRepository partnerRepository;

//    private final PartnerMapper partnerMapper;


    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;

    public User createUser(CreateUserDTO createUserDTO) {
        var userRole = roleRepository.findByName("USER")
                // todo - better exception handling
                .orElseThrow(() -> new IllegalStateException("ROLE USER was not initiated"));
        User user = User.builder()
                .firstName(createUserDTO.getFirstName())
                .lastName(createUserDTO.getLastName())
                .email(createUserDTO.getEmail())
                .password(passwordEncoder.encode(createUserDTO.getPassword()))
                .phoneNumber(createUserDTO.getPhoneNumber())
                .address(createUserDTO.getAddress())
                .country(createUserDTO.getCountry())
                .accountLocked(false)
                .enabled(false)
                .role(ERole.USER)
                .dateOfBirth(createUserDTO.getDateOfBirth())
                .genre(createUserDTO.getGenre())
                .profilePicture(createUserDTO.getProfilePicture())
                .hasSelectedPreferences(false)
                .createdDate(LocalDateTime.now())
                .lastModifiedDate(LocalDateTime.now())
                .roles(List.of(userRole))


                .build();

        // Sauvegarde de l'utilisateur
        User savedUser = userRepository.save(user);

        // Ajouter l'utilisateur à la liste du rôle et sauvegarder le rôle
        userRole.getUsers().add(savedUser);
        roleRepository.save(userRole);
        try {
            sendValidationEmail(user);
        } catch (MessagingException e) {
            // Tu peux logger l’erreur, ou relancer une RuntimeException personnalisée
            throw new IllegalStateException("Email could not be sent", e);
        }
        return savedUser;
    }

    public Partner createPartner(PartnerDTO createPartnerDTO) {
        var userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new IllegalStateException("ROLE USER was not initiated"));

        // Récupération du rôle 'USER' (ou un rôle spécifique pour le partenaire si nécessaire)
        var partnerRole = roleRepository.findByName("PARTNER")
                .orElseThrow(() -> new IllegalStateException("ROLE PARTNER was not initiated"));

        // Création de l'utilisateur de type Partner
        Partner partner = Partner.builder()
                .firstName(createPartnerDTO.getFirstname())
                .lastName(createPartnerDTO.getLastname())
                .email(createPartnerDTO.getEmail())
                .password(passwordEncoder.encode(createPartnerDTO.getPassword()))
                .phoneNumber(createPartnerDTO.getPhoneNumber())
                .address(createPartnerDTO.getAddress())
                .country(createPartnerDTO.getCountry())
                .accountLocked(false)
                .enabled(false)
                .role(ERole.PARTNER)
                .profilePicture(createPartnerDTO.getProfilePicture())
                .hasSelectedPreferences(true)
                .createdDate(LocalDateTime.now())
                .lastModifiedDate(LocalDateTime.now())
                .businessCategory(createPartnerDTO.getBusinessCategory()) // Attribut spécifique à Partner
                .partnerDescription(createPartnerDTO.getPartnerDescription()) // Description spécifique
                .partnershipStatus(createPartnerDTO.getPartnershipStatus()) // Statut du partenariat spécifique
                .contractStartDate(createPartnerDTO.getContractStartDate()) // Date de début
                .contractEndDate(createPartnerDTO.getContractEndDate()) // Date de fin
                .websiteURL(createPartnerDTO.getWebsiteURL()) // URL du site web
                .roles(List.of(userRole, partnerRole))  // Assigner les deux rôles USER et PARTNER
                .build();

        Partner savedPartner = partnerRepository.save(partner);
        userRole.getUsers().add(savedPartner);
        partnerRole.getUsers().add(savedPartner);
        roleRepository.save(userRole);
        roleRepository.save(partnerRole);

        // Envoi de l'email de validation
        try {
            sendValidationEmail(savedPartner);
        } catch (MessagingException e) {
            throw new IllegalStateException("Email could not be sent", e);
        }

        return savedPartner;
    }

//    public Partner registerPartner(PartnerDTO registerPartnerDTO) {
//        var userRole = roleRepository.findByName("USER")
//                .orElseThrow(() -> new IllegalStateException("ROLE USER was not initiated"));
//
//        // Récupération du rôle 'USER' (ou un rôle spécifique pour le partenaire si nécessaire)
//        var partnerRole = roleRepository.findByName("PARTNER")
//                .orElseThrow(() -> new IllegalStateException("ROLE PARTNER was not initiated"));
//
//        // Création de l'utilisateur de type Partner
//        Partner partner = Partner.builder()
//                .firstName(registerPartnerDTO.getFirstname())
//                .lastName(registerPartnerDTO.getLastname())
//                .email(registerPartnerDTO.getEmail())
//                .password(passwordEncoder.encode(registerPartnerDTO.getPassword()))
//                .phoneNumber(registerPartnerDTO.getPhoneNumber())
//                .address(registerPartnerDTO.getAddress())
//                .country(registerPartnerDTO.getCountry())
//                .accountLocked(false)
//                .enabled(false)
//                .role(ERole.PARTNER)
//                .profilePicture(registerPartnerDTO.getProfilePicture())
//                .hasSelectedPreferences(true)
//                .createdDate(LocalDateTime.now())
//                .lastModifiedDate(LocalDateTime.now())
//                .businessCategory(registerPartnerDTO.getBusinessCategory()) // Attribut spécifique à Partner
//                .partnerDescription(registerPartnerDTO.getPartnerDescription()) // Description spécifique
//                .partnershipStatus(registerPartnerDTO.getPartnershipStatus()) // Statut du partenariat spécifique
//                .contractStartDate(registerPartnerDTO.getContractStartDate()) // Date de début
//                .contractEndDate(registerPartnerDTO.getContractEndDate()) // Date de fin
//                .websiteURL(registerPartnerDTO.getWebsiteURL()) // URL du site web
//                .roles(List.of(userRole, partnerRole))  // Assigner les deux rôles USER et PARTNER
//                .build();
//
//        Partner savedPartner = partnerRepository.save(partner);
//        userRole.getUsers().add(savedPartner);
//        partnerRole.getUsers().add(savedPartner);
//        roleRepository.save(userRole);
//        roleRepository.save(partnerRole);
//
//        // Envoi de l'email de validation
//        try {
//            sendValidationEmail(savedPartner);
//        } catch (MessagingException e) {
//            throw new IllegalStateException("Email could not be sent", e);
//        }
//
//        return savedPartner;
//    }
//


    public void register(RegistrationRequest request) throws MessagingException {
        var userRole = roleRepository.findByName("USER")
                // todo - better exception handling
                .orElseThrow(() -> new IllegalStateException("ROLE USER was not initiated"));
        var user = User.builder()
                .firstName(request.getFirstname())
                .lastName(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .accountLocked(false)
                .enabled(false)
                .role(ERole.USER) // <-- Ajouter cette ligne pour éviter le null
                .roles(List.of(userRole))
                .build();
        // Associer l'utilisateur au rôle en ajoutant l'utilisateur à la liste des utilisateurs du rôle
        userRole.getUsers().add(user);  // Ceci ajoute l'utilisateur à la liste des utilisateurs du rôle "USER"

        userRepository.save(user);
        // Sauvegarde du rôle avec la relation mise à jour
        roleRepository.save(userRole);  // Assurez-vous que la relation est persistée
        sendValidationEmail(user);
    }





//        public void registerPartner(PartnerDTO request) throws MessagingException {
//            // Recherche des rôles "USER" et "PARTNER" dans la base de données
//            var userRole = roleRepository.findByName("USER")
//                    .orElseThrow(() -> new IllegalStateException("ROLE USER was not initiated"));
//
//            var partnerRole = roleRepository.findByName("PARTNER")
//                    .orElseThrow(() -> new IllegalStateException("ROLE PARTNER was not initiated"));
//
//            // Création du partenaire
//            Partner partner = Partner.builder()
//                    .firstName(request.getFirstname())
//                    .lastName(request.getLastname())
//                    .email(request.getEmail())
//                    .password(passwordEncoder.encode(request.getPassword()))
//                    .accountLocked(false)
//                    .enabled(false)
//                    .role(ERole.PARTNER)
//                    .roles(List.of(userRole, partnerRole))  // Assigner les deux rôles USER et PARTNER
//                    .partnerDescription(request.getPartnerDescription()) // Informations spécifiques au partenaire
//                    .businessCategory(request.getBusinessCategory()) // Attribut spécifique à Partner
//
////                    .businessCategory(BusinessCategory.valueOf(request.getBusinessCategory()))  // Catégorie d'entreprise
//                    .partnershipStatus(PartnershipStatus.PENDING) // Statut du partenariat par défaut
//                    .contractEndDate(request.getContractStartDate()) // Date de début du contrat
//                    .contractEndDate(request.getContractEndDate()) // Date de fin du contrat
////                    .contractStartDate(LocalDate.parse(request.getContractStartDate()))
////                    .contractEndDate(LocalDate.parse(request.getContractEndDate()))
//                    .websiteURL(request.getWebsiteURL()) // URL du site web
//                    .build();
//
//            // Ajouter l'utilisateur à la liste des utilisateurs de chaque rôle
//            userRole.getUsers().add(partner);
//            partnerRole.getUsers().add(partner);
//
//            // Sauvegarder l'utilisateur (le partenaire)
//            userRepository.save(partner);
//
//            // Sauvegarder les rôles avec les relations mises à jour
//            roleRepository.save(userRole);
//            roleRepository.save(partnerRole);
//
//            // Envoi de l'email de validation
//            sendValidationEmail(partner);
//        }


        public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var claims = new HashMap<String, Object>();
        var user = ((User) auth.getPrincipal());
        claims.put("fullName", user.getFullName());

        var jwtToken = jwtService.generateToken(claims, (User) auth.getPrincipal());
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    @Transactional
    public void activateAccount(String token) throws MessagingException {
        Token savedToken = tokenRepository.findByToken(token)
                // todo exception has to be defined
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation token has expired. A new token has been send to the same email address");
        }

        var user = userRepository.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);

        savedToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(savedToken);
    }

    private String generateAndSaveActivationToken(User user) {
        // Generate a token
        String generatedToken = generateActivationCode(6);
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenRepository.save(token);

        return generatedToken;
    }

//    private void sendValidationEmail(User user) throws MessagingException {
//        var newToken = generateAndSaveActivationToken(user);
//
//        emailService.sendEmail(
//                user.getEmail(),
//                user.getFullName(),
//                EmailTemplateName.ACTIVATE_ACCOUNT,
//                activationUrl,
//                newToken,
//                "Account activation"
//                );
//    }

    private void sendValidationEmail(User user) throws MessagingException {
        String token = generateAndSaveActivationToken(user);
        String confirmationUrl = String.format(activationUrl, token);

        String subject = "Activate Your Account";
        String text = "<p>Hello " + user.getFirstname() + ",</p>"
                + "<p>Please click the link below to activate your account:</p>"
                + "<a href=\"" + confirmationUrl + "\">Activate Now</a>"
                + "<p>This link will expire in 15 minutes.</p>";

        emailService.sendEmail(user.getEmail(), subject, text);
    }


    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();

        SecureRandom secureRandom = new SecureRandom();

        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }

        return codeBuilder.toString();
    }


    public User findUserByToken(String token) {
        // Extraire le nom d'utilisateur du token
        String username = jwtService.extractUsername(token);

        // Récupérer l'utilisateur par son nom d'utilisateur
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }


//    public User getCurrentUser() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication != null && authentication.getPrincipal() instanceof User) {
//            return (User) authentication.getPrincipal();
//        }
//        throw new UsernameNotFoundException("User not found");
//    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User user = (User) authentication.getPrincipal();

            // If the user is a Partner, fetch the Partner entity
            if (user.getRole() != null && user.getRole().equals("PARTNER")) {
                // Return the Partner with all Partner-specific fields
                return partnerRepository.findById(user.getId())
                        .orElseThrow(() -> new UsernameNotFoundException("Partner not found"));
            }

            return user;
        }
        throw new UsernameNotFoundException("User not found");
    }

    public Long getCurrentUserId() {
        User user = getCurrentUser();
        return user.getId();
    }
    // Update a user's profile picture by ID and filename
    public User updateUserProfilePicture(Long userId, String fileName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        user.setProfilePicture(fileName);
        return userRepository.save(user);
    }

//    // Update a partner's profile picture by ID and filename
//    public Partner updatePartnerProfilePicture(Long partnerId, String fileName) {
//        Partner partner = partnerRepository.findById(partnerId)
//                .orElseThrow(() -> new UsernameNotFoundException("Partner not found with id: " + partnerId));
//        partner.setProfilePicture(fileName);
//        return partnerRepository.save(partner);
//    }
// Method to change a user's password
public boolean changePassword(Long userId, String newPassword) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

    // Encode the new password
    user.setPassword(passwordEncoder.encode(newPassword));
    user.setLastModifiedDate(LocalDateTime.now());

    // Save the updated user
    userRepository.save(user);
    return true;
}

    // Method to send password reset code via email
    public void sendPasswordResetEmail(String email) throws MessagingException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No user found with email: " + email));

        // Generate and save reset code
        String resetCode = generateActivationCode(6);

        // Create a token for password reset
        Token token = Token.builder()
                .token(resetCode)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();

        tokenRepository.save(token);

        // Send the email with reset code
        String subject = "Password Reset Code";
        String text = "<p>Hello " + user.getFirstname() + ",</p>"
                + "<p>You have requested to reset your password. Please use the following code:</p>"
                + "<h2 style='background-color: #f1f1f1; padding: 10px; text-align: center;'>" + resetCode + "</h2>"
                + "<p>This code will expire in 15 minutes.</p>"
                + "<p>If you did not request a password reset, please ignore this email.</p>";

        emailService.sendEmail(user.getEmail(), subject, text);
    }

    // Method to verify reset code and change password
    public boolean resetPassword(String email, String resetCode, String newPassword) {
        // Verify user exists
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No user found with email: " + email));

        // Find the token
        Token savedToken = tokenRepository.findByToken(resetCode)
                .orElseThrow(() -> new RuntimeException("Invalid reset code"));

        // Verify token belongs to user and is not expired
        if (!savedToken.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Reset code does not match user");
        }

        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            throw new RuntimeException("Reset code has expired");
        }

        // Change password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setLastModifiedDate(LocalDateTime.now());
        userRepository.save(user);

        // Mark token as used
        savedToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(savedToken);

        return true;
    }



}
