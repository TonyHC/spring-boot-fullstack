package com.tonyhc.springbootdemo.cloudinary;

import org.apache.commons.io.FileUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Random;
import java.util.UUID;

@Service
@ConditionalOnProperty(
        value = "cloudinary.enabled",
        havingValue = "false"
)
public class MockCloudinaryService implements ImageUpload {
    private static final String PATH = System.getProperty("user.home") + "/.tonyhc/cloudinary";

    @Override
    public String uploadImage(String folderPath, MultipartFile multipartFile) {
        Random random = new Random();
        int version = random.nextInt(999999999) + 1000000000;

        String profileImage = UUID.randomUUID().toString();

        try {
            // Write the incoming image to your local file system
            FileUtils.writeByteArrayToFile(
                    new File(
                            buildObjectFullPath(
                                    folderPath,
                                    profileImage
                            )
                    ),
                    multipartFile.getBytes()
            );

            return buildImageDomainPath(version, folderPath, profileImage);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String buildObjectFullPath(String folderPath, String profileImage) {
        return PATH + "/" + folderPath + "/" + profileImage;
    }

    private String buildImageDomainPath(Integer version, String folderPath, String publicId) {
        return "/v" + version + folderPath + "/" + publicId;
    }
}
