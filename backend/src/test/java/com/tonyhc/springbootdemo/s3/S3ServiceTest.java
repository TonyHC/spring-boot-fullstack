package com.tonyhc.springbootdemo.s3;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class S3ServiceTest {
    @Mock
    private S3Client s3Client;

    @InjectMocks
    private S3Service underTest;

    @BeforeEach
    void setUp() {
        underTest = new S3Service(s3Client);
    }

    @Test
    void itShouldUploadObject() throws IOException {
        // Given
        String bucketName = "bucketName";
        String key = "key";
        byte[] file = "test".getBytes();

        // When
        underTest.uploadObject(bucketName, key, file);

        // Then
        ArgumentCaptor<PutObjectRequest> putObjectRequestArgumentCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
        ArgumentCaptor<RequestBody> requestBodyArgumentCaptor = ArgumentCaptor.forClass(RequestBody.class);
        verify(s3Client).putObject(putObjectRequestArgumentCaptor.capture(), requestBodyArgumentCaptor.capture());

        PutObjectRequest putObjectRequestArgumentCaptorValue = putObjectRequestArgumentCaptor.getValue();
        RequestBody requestBodyArgumentCaptorValue = requestBodyArgumentCaptor.getValue();

        assertThat(putObjectRequestArgumentCaptorValue.bucket()).isEqualTo(bucketName);
        assertThat(putObjectRequestArgumentCaptorValue.key()).isEqualTo(key);

        assertThat(requestBodyArgumentCaptorValue.contentStreamProvider().newStream().readAllBytes())
                .isEqualTo(RequestBody.fromBytes(file).contentStreamProvider().newStream().readAllBytes());
    }

    @Test
    void itShouldDownloadObject() throws IOException {
        // Given
        String bucketName = "bucketName";
        String key = "key";
        byte[] file = "test".getBytes();

        GetObjectRequest objectRequest = buildGetObjectRequest(bucketName, key);
        ResponseInputStream<GetObjectResponse> response = mock(ResponseInputStream.class);

        when(response.readAllBytes()).thenReturn(file);
        when(s3Client.getObject(objectRequest)).thenReturn(response);

        // When
        byte[] data = underTest.downloadObject(bucketName, key);

        // Then
        assertThat(data).isEqualTo(file);
    }

    @Test
    void itShouldThrowWhenFileToUploadIsAZeroByteFile() throws IOException {
        // Given
        String bucketName = "bucketName";
        String key = "key";

        GetObjectRequest objectRequest = buildGetObjectRequest(bucketName, key);
        ResponseInputStream<GetObjectResponse> response = mock(ResponseInputStream.class);

        when(response.readAllBytes()).thenThrow(new IOException("Cannot read bytes"));
        when(s3Client.getObject(objectRequest)).thenReturn(response);

        // When
        // Then
        assertThatThrownBy(() -> underTest.downloadObject(bucketName, key))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Cannot read bytes")
                .hasRootCauseInstanceOf(IOException.class);
    }

    private GetObjectRequest buildGetObjectRequest(String bucketName, String key) {
        return GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
    }
}