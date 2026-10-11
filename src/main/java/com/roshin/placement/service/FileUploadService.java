package com.roshin.placement.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import java.awt.Image;
import java.util.Arrays;

@Service
public class FileUploadService {
    
    private final String UPLOAD_DIR = "uploads/profile_pictures/";

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

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
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
        outputImage.getGraphics().drawImage(resultingImage, 0, 0, null);

        String filename = UUID.randomUUID().toString() + ".png";
        Path filePath = uploadPath.resolve(filename);
        ImageIO.write(outputImage, "png", filePath.toFile());

        return "/uploads/profile_pictures/" + filename;
    }
}
