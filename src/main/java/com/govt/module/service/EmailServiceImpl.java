package com.govt.module.service;

import com.govt.module.model.EmailDetails;
import com.govt.module.response.EmailResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import java.io.File;

@Service
public class EmailServiceImpl implements EmailService {
    // followed the below article
    // https://www.geeksforgeeks.org/spring-boot-sending-email-via-smtp/
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;

    private final EmailRepository emailRepository;

    @Autowired
    public EmailServiceImpl(EmailRepository emailRepository) {
        this.emailRepository = emailRepository;
    }

    @Override
    public EmailResponseDTO sendSimpleMail(EmailDetails details) {
        EmailResponseDTO response = new EmailResponseDTO();
        try {
            // create simple mail message
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(this.sender);
            message.setTo(details.getRecipient());
            message.setText(details.getMsgBody());
            message.setSubject(details.getSubject());

            // send the mail
            javaMailSender.send(message);
            EmailDetails email = this.emailRepository.save(details);
            response.setSuccess(true);
            response.setMessage("Mail sent successfully!");
        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("Mail sending failed!");
        }
        return response;
    }

    @Override
    public EmailResponseDTO sendMailWithAttachment(EmailDetails details) {

        EmailResponseDTO response = new EmailResponseDTO();
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper;

        try {
            // setting multipart true
            mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
            mimeMessageHelper.setFrom(this.sender);
            mimeMessageHelper.setTo(details.getRecipient());
            mimeMessageHelper.setText(details.getMsgBody());
            mimeMessageHelper.setSubject(details.getSubject());

            // adding attachment
            FileSystemResource file = new FileSystemResource(new File(details.getAttachment()));
            mimeMessageHelper.addAttachment(file.getFilename(), file);

            // send mail
            javaMailSender.send(mimeMessage);
            EmailDetails email = this.emailRepository.save(details);
            response.setSuccess(true);
            response.setMessage("Mail sent successfully!");
        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("Mail sending failed!");
        }
        return response;
    }

    @Override
    public EmailDetails save(EmailDetails details) {
        return emailRepository.save(details);
    }
}
