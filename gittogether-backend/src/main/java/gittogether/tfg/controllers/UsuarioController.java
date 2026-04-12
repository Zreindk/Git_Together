package gittogether.tfg.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gittogether.tfg.entities.LoginRequest;
import gittogether.tfg.entities.LoginResponse;
import gittogether.tfg.entities.Usuario;
import gittogether.tfg.services.UsuarioService;
import gittogether.tfg.util.JwtUtil;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200") // lo utilizamos para realizar testeos en angular
public class UsuarioController {

	@Autowired
	private UsuarioService usuarioService;
	
	

	@PostMapping("/registrar")
	public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
		try {
			Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
			return ResponseEntity.ok(nuevoUsuario);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	// GET: http://localhost:8080/api/usuarios
	@GetMapping
	public ResponseEntity<List<Usuario>> listarUsuarios() {
		return ResponseEntity.ok(usuarioService.obtenerTodos());
	}

	// GET: http://localhost:8080/api/usuarios/{id}
	@GetMapping("/{id}")
	public ResponseEntity<?> obtenerUsuarioPorId(@PathVariable int id) {
		try {
			Usuario usuario = usuarioService.obtenerPorId(id);
			return ResponseEntity.ok(usuario);
		} catch (RuntimeException e) {
			return ResponseEntity.status(404).body(e.getMessage());
		}
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
	    // Buscamos al usuario en la BD
	    Usuario usuario = usuarioService.autenticar(loginRequest.getIdentificador(), loginRequest.getPassword());

	    if (usuario != null) {
	        // Generamos un token
	    	String jwtToken = JwtUtil.generateToken(usuario.getEmail());

	        // Enviamos el objeto combinado
	        return ResponseEntity.ok(new LoginResponse(jwtToken, usuario));
	    } else {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado");
	    }
	}
}
