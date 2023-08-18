package com.govt.module.service;

import com.govt.module.model.EmailDetails;
import com.govt.module.response.EmailResponseDTO;

public interface EmailService {
    EmailResponseDTO sendSimpleMail(EmailDetails details);
    EmailResponseDTO sendMailWithAttachment(EmailDetails details);
    EmailDetails save(EmailDetails details);
}
