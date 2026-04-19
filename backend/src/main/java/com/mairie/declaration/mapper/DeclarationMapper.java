package com.mairie.declaration.mapper;

import com.mairie.declaration.dto.response.DeclarationResponse;
import com.mairie.declaration.entity.Declaration;
import com.mairie.declaration.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DeclarationMapper {

    @Mapping(source = "createdBy", target = "createdByName", qualifiedByName = "fullName")
    @Mapping(source = "processedBy", target = "processedByName", qualifiedByName = "fullName")
    DeclarationResponse toResponse(Declaration declaration);

    List<DeclarationResponse> toResponseList(List<Declaration> declarations);

    @Named("fullName")
    default String fullName(User user) {
        if (user == null) {
            return null;
        }
        return user.getFirstName() + " " + user.getLastName();
    }
}
