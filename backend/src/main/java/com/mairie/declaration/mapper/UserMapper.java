package com.mairie.declaration.mapper;

import com.mairie.declaration.dto.response.UserResponse;
import com.mairie.declaration.entity.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toResponse(User user);

    List<UserResponse> toResponseList(List<User> users);
}
