package com.roshin.placement.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import java.awt.Image;
import java.awt.Graphics2D;
import java.util.Arrays;

@Service
public class FileUploadService {

    public String saveProfilePicture(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file.");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !Arrays.asList("image/jpeg", "image/jpg", "image/png", "image/webp").contains(contentType)) {
            throw new IllegalArgumentException("Unsupported file type. Only JPG, PNG, and WEBP are allowed.");
        }
        
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("File too large. Maximum size is 5MB.");
        }

        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        if (originalImage == null) {
            throw new IllegalArgumentException("Invalid image file or corrupted image.");
        }

        int minDim = Math.min(originalImage.getWidth(), originalImage.getHeight());
        BufferedImage cropped = originalImage.getSubimage(
            (originalImage.getWidth() - minDim) / 2,
            (originalImage.getHeight() - minDim) / 2,
            minDim, minDim
        );
        int targetDim = Math.min(minDim, 400);
        Image resultingImage = cropped.getScaledInstance(targetDim, targetDim, Image.SCALE_SMOOTH);
        BufferedImage outputImage = new BufferedImage(targetDim, targetDim, BufferedImage.TYPE_INT_ARGB);
        Graphics2D graphics = outputImage.createGraphics();
        graphics.drawImage(resultingImage, 0, 0, null);
        graphics.dispose();

        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            if (!ImageIO.write(outputImage, "png", output)) {
                throw new IOException("Could not encode the profile picture.");
            }
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(output.toByteArray());
        }
    }
}
