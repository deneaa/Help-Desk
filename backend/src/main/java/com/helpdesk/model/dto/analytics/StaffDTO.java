package com.helpdesk.model.dto.analytics;

import com.helpdesk.model.dto.user.UserPublicDTO;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StaffDTO {
    private List<UserPublicDTO> admins;
    private List<UserPublicDTO> agents;
}
