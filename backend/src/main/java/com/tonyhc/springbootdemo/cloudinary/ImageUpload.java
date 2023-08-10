package com.tonyhc.springbootdemo.cloudinary;

import org.springframework.web.multipart.MultipartFile;

public interface ImageUpload {
    String uploadImage(String folderPath, MultipartFile multipartFile);
}
