package com.openclassrooms.starterjwt.unit.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

// tests unitaires

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

    @Mock private SessionRepository sessionRepository;
    @Mock private UserRepository userRepository;
    @InjectMocks private SessionService sessionService;

    private final Session session = Session.builder()
            .id(1L).name("Yoga").date(new Date()).description("session de yoga").build();

    @Test
    void findAll() {
        given(sessionRepository.findAll()).willReturn(List.of(session));
        List<Session> result = sessionService.findAll();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Yoga");
        verify(sessionRepository).findAll();
    }

    @Test
    void getById_Found() {
        given(sessionRepository.findById(1L)).willReturn(Optional.of(session));

        Session result = sessionService.getById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        verify(sessionRepository).findById(1L);
    }

    @Test
    void getById_NotFound() {
        given(sessionRepository.findById(999L)).willReturn(Optional.empty());

        Session result = sessionService.getById(999L);

        assertThat(result).isNull();
        verify(sessionRepository).findById(999L);
    }

    @Test
    void create() {
        Session newSession = Session.builder().name("Yoga Avancé").description("Cours avancé").date(new Date()).build();

        given(sessionRepository.save(any(Session.class))).willAnswer(invocation -> {
            Session s = invocation.getArgument(0);
            s.setId(2L);
            return s;
        });

        Session result = sessionService.create(newSession);

        assertThat(result.getId()).isEqualTo(2L);
        assertThat(result.getName()).isEqualTo("Yoga Avancé");
        verify(sessionRepository).save(newSession);
    }

    @Test
    void update_Found() {
        session.setName("Updated");
        sessionService.update(1L, session);

        verify(sessionRepository).save(session);
    }

    @Test
    void delete_Found() {
        sessionService.delete(1L);

        verify(sessionRepository).deleteById(1L);
    }

    @Test
    void participate() {
        Session fullSession = Session.builder()
                .id(1L)
                .name("Test")
                .description("Test")
                .date(new Date())
                .users(new ArrayList<>())
                .build();

        User fullUser = new User();
        fullUser.setId(1L);

        lenient().when(sessionRepository.findById(1L)).thenReturn(Optional.of(fullSession));
        lenient().when(userRepository.findById(1L)).thenReturn(Optional.of(fullUser));

        sessionService.participate(1L, 1L);

        assertThat(fullSession.getUsers()).contains(fullUser);
        verify(sessionRepository).save(fullSession);
    }

    @Test
    void participate_sessionNotFound() {
        when(sessionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(99L, 1L));
    }

    @Test
    void participate_userNotFound() {
        Session session = Session.builder().id(1L).users(new ArrayList<>()).build();
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 99L));
    }

    @Test
    void participate_userAlreadyInSession() {
        User user = new User(); user.setId(1L);
        Session session = Session.builder()
                .id(1L)
                .users(new ArrayList<>(List.of(user)))
                .build();

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> sessionService.participate(1L, 1L));

        verify(sessionRepository, never()).save(any());
    }

    @Test
    void noLongerParticipate() {
        User user = new User(); user.setId(1L);
        session.setUsers(List.of(user));

        given(sessionRepository.findById(1L)).willReturn(Optional.of(session));

        sessionService.noLongerParticipate(1L, 1L);

        assertThat(session.getUsers()).doesNotContain(user);
        verify(sessionRepository).save(session);
    }
}
