package com.mairie.declaration.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsResponse {
    private long totalDeclarations;
    private long pendingDeclarations;
    private long approvedDeclarations;
    private long rejectedDeclarations;
    private long totalUsers;
    private long totalCitizens;
    private long totalAgents;
}
