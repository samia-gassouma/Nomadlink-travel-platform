package tn.cloudcrafters.picloud.SecurityAll.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class RegistrationPartnerRequest {
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private String partnerDescription;
    private String businessCategory;
    private LocalDate contractStartDate;
    private LocalDate contractEndDate;
    private String websiteURL;
    private String phoneNumber;
    private String address;
    private String country;
//
//    @NotEmpty(message = "Firstname is mandatory")
//    @NotNull(message = "Firstname is mandatory")
//    private String firstname;
//    @NotEmpty(message = "Lastname is mandatory")
//    @NotNull(message = "Lastname is mandatory")
//    private String lastname;
//    @Email(message = "Email is not well formatted")
//    @NotEmpty(message = "Email is mandatory")
//    @NotNull(message = "Email is mandatory")
//    private String email;
//    @NotEmpty(message = "Partner description is mandatory")
//    private String partnerDescription;
//
//    @NotNull(message = "Business category is mandatory")
//    private String businessCategory;
//
//    @NotNull(message = "Contract start date is mandatory")
//    private LocalDate contractStartDate;
//
//    @NotNull(message = "Contract end date is mandatory")
//    private LocalDate contractEndDate;
//
//    @NotEmpty(message = "Website URL is mandatory")
////    @Pattern(regexp = "^(https?:\\/\\/)?([\\w-]+\\.)+[\\w-]+(\\/\\S*)?$", message = "Invalid website URL")
//    private String websiteURL;
//
//    public String getFirstname() {
//        return firstname;
//    }
//
//    public void setFirstname(String firstname) {
//        this.firstname = firstname;
//    }
//
//    public String getLastname() {
//        return lastname;
//    }
//
//    public void setLastname(String lastname) {
//        this.lastname = lastname;
//    }
//
//    public String getEmail() {
//        return email;
//    }
//
//    public void setEmail(String email) {
//        this.email = email;
//    }
//
//    public String getPassword() {
//        return password;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
//    }
//
//    @NotEmpty(message = "Password is mandatory")
//    @NotNull(message = "Password is mandatory")
//    @Size(min = 8, message = "Password should be 8 characters long minimum")
//    private String password;
}