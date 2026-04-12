package gittogether.tfg.controllers;

import gittogether.tfg.entities.Categoria;
import gittogether.tfg.repositories.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoriaController {

	@Autowired
	private CategoriaRepository categoriaRepository;

	// Obtenemos todas las categorías directamente del repositorio
	@GetMapping
	public List<Categoria> listar() {
		return categoriaRepository.findAll();
	}
}