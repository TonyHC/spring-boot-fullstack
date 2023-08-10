package com.tonyhc.springbootdemo.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CloudinaryServiceTest {
    @Mock
    private Cloudinary cloudinary;

    @InjectMocks
    private CloudinaryService underTest;

    @BeforeEach
    void setUp() {
        underTest = new CloudinaryService(cloudinary);
    }

    @Test
    void itShouldUploadFile() throws IOException {
        // Given
        String folderPath = "/profile-images/2";
        byte[] file = "SomeImage".getBytes();
        MockMultipartFile multipartFile = new MockMultipartFile("image", file);

        Map<String, Object> options = new HashMap<>();

        options.put("use_filename", false);
        options.put("folder", folderPath);

        Map<Object, Object> response = new HashMap<>();

        response.put("version", "1895629381");
        response.put("public_id", "customer");

        String expectedImageDomainPath = "/v" + response.get("version") + "/" + response.get("public_id");

        Uploader mock = mock(Uploader.class);
        when(cloudinary.uploader()).thenReturn(mock);
        when(mock.upload(file, options)).thenReturn(response);

        // When
        String actualImageDomainPath = underTest.uploadImage(folderPath, multipartFile);

        // Then
        assertThat(actualImageDomainPath).isEqualTo(expectedImageDomainPath);
    }

    @Test
    void itShouldThrowWhen() throws IOException {
        // Given
        String folderPath = "/profile-images/2";
        byte[] file = "SomeImage".getBytes();
        MockMultipartFile multipartFile = new MockMultipartFile("image", file);

        Map<String, Object> options = new HashMap<>();

        options.put("use_filename", false);
        options.put("folder", folderPath);

        Map<Object, Object> response = new HashMap<>();

        response.put("version", "1895629381");
        response.put("public_id", "customer");

        Uploader mock = mock(Uploader.class);
        when(cloudinary.uploader()).thenReturn(mock);
        when(mock.upload(file, options)).thenThrow(new IOException("Cannot upload image"));

        // When
        // Then
        assertThatThrownBy(() -> underTest.uploadImage(folderPath, multipartFile))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Cannot upload image")
                .hasRootCauseInstanceOf(IOException.class);
    }
}