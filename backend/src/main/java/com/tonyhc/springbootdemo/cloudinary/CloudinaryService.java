package com.tonyhc.springbootdemo.cloudinary;

import com.cloudinary.Cloudinary;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@ConditionalOnProperty(
        value = "cloudinary.enabled",
        havingValue = "true"
)
public class CloudinaryService implements ImageUpload {
    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public String uploadImage(String folderPath, MultipartFile multipartFile) {
        try {
            Map<String, Object> options = new HashMap<>();

            options.put("use_filename", false);
            options.put("folder", folderPath);

            Map upload = cloudinary.uploader().upload(multipartFile.getBytes(), options);
            return buildImageDomainPath(upload.get("version"), upload.get("public_id"));
        } catch (IOException ioException) {
            throw new RuntimeException("Cannot upload image", ioException);
        }
    }

    private String buildImageDomainPath(Object version, Object publicId) {
        return "/v" + version + "/" + publicId;
    }
}
