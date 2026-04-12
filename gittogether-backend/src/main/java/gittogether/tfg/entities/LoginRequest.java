package gittogether.tfg.entities;

/**
 * Clase para confirmar el login
 */
public class LoginRequest {
	private String identificador;
	private String password;

	public LoginRequest() {
	}

	public String getIdentificador() {
		return identificador;
	}

	public void setIdentificador(String identificador) {
		this.identificador = identificador;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}