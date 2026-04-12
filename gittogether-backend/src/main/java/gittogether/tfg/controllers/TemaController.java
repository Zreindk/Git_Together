package gittogether.tfg.controllers;

import gittogether.tfg.entities.Tema;
import gittogether.tfg.services.TemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/temas")
@CrossOrigin(origins = "*") // Permite que Angular acceda a los datos
public class TemaController {

	@Autowired
	private TemaService temaService;

	// Endpoint para obtener todos los temas
	@GetMapping
	public List<Tema> listar() {
		return temaService.listarTemas();
	}

	// Endpoint para filtrar por categoría
	@GetMapping("/categoria/{id}")
	public List<Tema> listarPorCategoria(@PathVariable int id) {
		return temaService.obtenerTemasPorCategoria(id);
	}

	// Endpoint para crear un tema desde el frontend
	@PostMapping
	public Tema crear(@RequestBody Tema tema) {
		return temaService.crearTema(tema);
	}
}