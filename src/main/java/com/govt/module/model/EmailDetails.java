package com.govt.module.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "email_details")
public class EmailDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;
    @Column(name = "sender")
    private String sender;
    @NotBlank(message = "Recipient can not be empty!")
    @Column(name = "recipient")
    private String recipient;
    @NotBlank(message = "Email body can not be empty!")
    @Column(name = "msg_body")
    private String msgBody;
    @NotBlank(message = "Subject can not be empty!")
    @Column(name = "subject")
    private String subject;
    @Column(name = "attachment")
    private String attachment;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "users_id", nullable = false)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    @JsonIgnore
    private User user;
}
