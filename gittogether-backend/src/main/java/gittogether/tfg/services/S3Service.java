package gittogether.tfg.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

@Service
public class S3Service {

    @Autowired
    private S3Client s3Client;

    @Autowired
    private S3Presigner s3Presigner;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    /**
     * Sube un archivo a S3 y devuelve la LLAVE (nombre del archivo), no la URL completa.
     */
    public String subirArchivo(MultipartFile archivo) throws IOException {
        String originalName = archivo.getOriginalFilename() != null ? archivo.getOriginalFilename().replace(" ", "_") : "avatar";
        String nombreArchivo = UUID.randomUUID().toString() + "_" + originalName;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(nombreArchivo)
                    .contentType(archivo.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(archivo.getInputStream(), archivo.getSize()));

            return nombreArchivo; // Devolvemos solo la llave
            
        } catch (S3Exception e) {
            if (e.awsErrorDetails().errorCode().equals("ExpiredToken")) {
                throw new RuntimeException("Las credenciales de AWS han caducado. Por favor, actualiza el application.properties.");
            }
            throw e;
        }
    }

    /**
     * Genera una URL prefirmada para acceder a un objeto privado.
     * @param key nombre del archivo en S3
     * @return URL temporal con firma
     */
    public String generarUrlPresignada(String key) {
        if (key == null || key.isEmpty()) return null;
        
        // Si por algun motivo ya viene con http (datos viejos o ya prefirmados), intentamos extraer la llave limpia
        if (key.startsWith("http")) {
            // Quitamos los query parameters si los hay (?X-Amz-...)
            if (key.contains("?")) {
                key = key.substring(0, key.indexOf("?"));
            }
            // Nos quedamos con lo que hay después de la última barra
            key = key.substring(key.lastIndexOf("/") + 1);
        }

        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(60)) // La URL durará 1 hora
                    .getObjectRequest(getObjectRequest)
                    .build();

            PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
            return presignedRequest.url().toString();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Procesa el avatar de un usuario para convertir la llave en una URL prefirmada.
     */
    public void procesarAvatar(gittogether.tfg.entities.Usuario usuario) {
        if (usuario != null && usuario.getAvatar() != null && !usuario.getAvatar().isEmpty()) {
            usuario.setAvatar(generarUrlPresignada(usuario.getAvatar()));
        }
    }

    /**
     * Procesa una lista de usuarios.
     */
    public void procesarAvatares(java.util.List<gittogether.tfg.entities.Usuario> usuarios) {
        if (usuarios != null) {
            usuarios.forEach(this::procesarAvatar);
        }
    }

    /**
     * Elimina un archivo de S3.
     * @param key nombre del archivo o URL completa
     */
    public void eliminarArchivo(String key) {
        if (key == null || key.isEmpty()) return;

        // Si viene la URL, extraemos la llave limpia (sin query params)
        if (key.startsWith("http")) {
            if (key.contains("?")) {
                key = key.substring(0, key.indexOf("?"));
            }
            key = key.substring(key.lastIndexOf("/") + 1);
        }

        try {
            software.amazon.awssdk.services.s3.model.DeleteObjectRequest deleteObjectRequest = 
                software.amazon.awssdk.services.s3.model.DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
        } catch (Exception e) {
            System.err.println("Error al eliminar archivo de S3: " + e.getMessage());
        }
    }
}
