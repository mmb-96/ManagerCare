package org.jacaranda.ies.aop.logging;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.junit.jupiter.api.Test;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;

class LoggingAspectTest {

    @Test
    void logsMethodBoundariesWithoutArgumentsOrResults() throws Throwable {
        String password = "sensitive-password";
        String resetKey = "sensitive-reset-key";
        String activationKey = "sensitive-activation-key";
        Logger logger = (Logger) LoggerFactory.getLogger(SensitiveService.class);
        Level previousLevel = logger.getLevel();
        ListAppender<ILoggingEvent> appender = new ListAppender<>();
        logger.setLevel(Level.DEBUG);
        appender.start();
        logger.addAppender(appender);

        try {
            ProceedingJoinPoint joinPoint = mock(ProceedingJoinPoint.class);
            Signature signature = mock(Signature.class);
            when(joinPoint.getSignature()).thenReturn(signature);
            when(signature.getName()).thenReturn("completePasswordReset");
            when(signature.getDeclaringTypeName()).thenReturn(SensitiveService.class.getName());
            when(joinPoint.getArgs()).thenReturn(new Object[] { password, resetKey });
            when(joinPoint.proceed()).thenReturn(new SensitiveResult(activationKey));

            Object result = new LoggingAspect(mock(Environment.class)).logAround(joinPoint);
            String messages = appender.list.stream().map(ILoggingEvent::getFormattedMessage).reduce("", (left, right) -> left + right);

            assertThat(result).isInstanceOf(SensitiveResult.class);
            assertThat(messages).contains("Enter: completePasswordReset()", "Exit: completePasswordReset()");
            assertThat(messages).doesNotContain(password, resetKey, activationKey);
        } finally {
            logger.detachAppender(appender);
            appender.stop();
            logger.setLevel(previousLevel);
        }
    }

    private static final class SensitiveService {}

    private record SensitiveResult(String activationKey) {}
}
