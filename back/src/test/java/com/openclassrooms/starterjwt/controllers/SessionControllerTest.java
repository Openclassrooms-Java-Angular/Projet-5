package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.repository.SessionRepository;

import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.*;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc(addFilters = false)
class SessionControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Session session;

    @MockBean
    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        sessionRepository.deleteAll();

        session = Session.builder()
                .name("Yoga Débutant")
                .description("Cours test")
                .date(new Date())
                .build();
        session = sessionRepository.save(session);

        when(jwtUtils.validateJwtToken(any())).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken(any())).thenReturn("yoga@studio.com");
    }

    @Test
    void testGetSessions() throws Exception {
        mockMvc.perform(get("/api/session"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Yoga Débutant"));
    }

    @Test
    void testGetSessionById() throws Exception {
        mockMvc.perform(get("/api/session/{id}", session.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Yoga Débutant"));
    }

    @Test
    void testGetSessionByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/session/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateSession() throws Exception {
        SessionDto newSession = new SessionDto();
        newSession.setName("Yoga Avancé");
        newSession.setDescription("Cours avancé");
        newSession.setDate(new Date());
        newSession.setTeacher_id(1L);
        newSession.setUsers(new ArrayList<>());

        mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newSession)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Yoga Avancé"))
                .andReturn();

        assertThat(sessionRepository.findAll()).hasSize(2);
    }

    @Test
    void testCreateSessionBadRequest() throws Exception {
        SessionDto invalidSession = new SessionDto();
        mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidSession)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testDeleteSession() throws Exception {

        mockMvc.perform(delete("/api/session/{id}", session.getId()))
                .andExpect(status().isOk());

        assertThat(sessionRepository.findById(session.getId())).isEmpty();
    }

    @Test
    void testDeleteSessionNotFound() throws Exception {
        mockMvc.perform(delete("/api/session/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetSessionByIdInvalidId() throws Exception {
        mockMvc.perform(get("/api/session/{id}", "abc"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetSessionsContainsUsers() throws Exception {
        mockMvc.perform(get("/api/session"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].users").isArray())
                .andExpect(jsonPath("$[0].users.length()").value(0));
    }
}