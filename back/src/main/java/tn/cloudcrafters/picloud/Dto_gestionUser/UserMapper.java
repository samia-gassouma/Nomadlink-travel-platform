package tn.cloudcrafters.picloud.Dto_gestionUser;

import tn.cloudcrafters.picloud.Entity.gestionUser.ERole;
import tn.cloudcrafters.picloud.Entity.gestionUser.Genre;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;

public class UserMapper {

    public static UserDto toUserDTO(User user) {
        if (user == null) {
            return null;
        }
        return UserDto.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .password(user.getPassword())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .country(user.getCountry())
                .accountLocked(user.isAccountLocked())
                .enabled(user.isEnabled())
                .role(user.getRole())
                .dateOfBirth(user.getDateOfBirth())
                .genre(user.getGenre())
                .profilePicture(user.getProfilePicture())
                .createdDate(user.getCreatedDate())
                .lastModifiedDate(user.getLastModifiedDate())
                .hasSelectedPreferences(user.isHasSelectedPreferences())
                .build();
    }

    public static User toUser(UserDto dto) {
        if (dto == null) {
            return null;
        }

        User user = new User();
        user.setId(dto.getId());
        user.setFirstname(dto.getFirstname());
        user.setLastname(dto.getLastname());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setAddress(dto.getAddress());
        user.setCountry(dto.getCountry());
        user.setAccountLocked(dto.isAccountLocked());
        user.setEnabled(dto.isEnabled());
        user.setRole(dto.getRole());
        user.setDateOfBirth(dto.getDateOfBirth());
        user.setGenre(dto.getGenre());
        user.setProfilePicture(dto.getProfilePicture());
        user.setCreatedDate(dto.getCreatedDate());
        user.setLastModifiedDate(dto.getLastModifiedDate());
        user.setHasSelectedPreferences(dto.isHasSelectedPreferences());
        return user;

    }
}
