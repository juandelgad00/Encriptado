const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "clave_super_segura";

// LOGIN
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Usuario y contraseña son requeridos" });
  }

  try {
    const query = `
      SELECT u.id_usuario, u.nick_name, d.grupo, d.email, d.contrasena AS hashed_password
      FROM Usuarios u
      INNER JOIN Detalle_Usuarios d ON u.id_usuario = d.id_usuario
      WHERE u.nick_name = $1
    `;
    const values = [username];
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.hashed_password);

      if (match) {
        const token = jwt.sign(
          { id: user.id_usuario, nickname: user.nick_name },
          SECRET_KEY,
          { expiresIn: "1h" }
        );

        // Guardar el token en la base de datos
        await pool.query(
          `UPDATE detalle_usuarios SET token = $1 WHERE id_usuario = $2`,
          [token, user.id_usuario]
        );

        res.json({
          success: true,
          id: user.id_usuario,
          nickname: user.nick_name,
          grupo: user.grupo,
          email: user.email,
          token: token,
        });
      } else {
        res.status(401).json({ success: false, message: "Credenciales incorrectas" });
      }
    } else {
      res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// OBTENER TODOS LOS USUARIOS
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id_usuario, u.nick_name, u.nombre, u.fecha, d.grupo, d.email
      FROM usuarios u
      INNER JOIN detalle_usuarios d ON u.id_usuario = d.id_usuario
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ success: false, message: "Error al consultar los usuarios" });
  }
};

// REGISTRO DE USUARIO
exports.registerUser = async (req, res) => {
  const { nick_name, contrasena, email, grupo, nombre } = req.body;

  if (!nick_name || !contrasena || !email || !grupo || !nombre) {
    return res.status(400).json({
      success: false,
      message: "Faltan campos requeridos: nick_name, contrasena, email, grupo, nombre",
    });
  }

  const client = await pool.connect();

  try {
    const checkNickNameQuery = 'SELECT id_usuario FROM usuarios WHERE nick_name = $1';
    const nickNameExistsResult = await client.query(checkNickNameQuery, [nick_name]);

    if (nickNameExistsResult.rows.length > 0) {
      return res.status(409).json({ success: false, message: "El nombre de usuario (nick_name) ya existe." });
    }

    const checkEmailQuery = 'SELECT id_usuario FROM detalle_usuarios WHERE email = $1';
    const emailExistsResult = await client.query(checkEmailQuery, [email]);

    if (emailExistsResult.rows.length > 0) {
      return res.status(409).json({ success: false, message: "El correo electrónico ya está registrado." });
    }

    await client.query("BEGIN");

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const userInsertQuery = `
      INSERT INTO usuarios (nick_name, nombre, fecha)
      VALUES ($1, $2, NOW())
      RETURNING id_usuario
    `;
    const userInsertValues = [nick_name, nombre];
    const userResult = await client.query(userInsertQuery, userInsertValues);

    if (userResult.rows.length === 0) {
      throw new Error("No se pudo crear el usuario en la tabla Usuarios.");
    }

    const newUserId = userResult.rows[0].id_usuario;

    const token = jwt.sign(
      { id: newUserId, nickname: nick_name },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    const estadoCuentaDefault = true;

    const detailInsertQuery = `
      INSERT INTO detalle_usuarios (id_usuario, grupo, email, contrasena, estado_cuenta, token)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const detailInsertValues = [
      newUserId,
      grupo,
      email,
      hashedPassword,
      estadoCuentaDefault,
      token,
    ];
    await client.query(detailInsertQuery, detailInsertValues);

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Usuario creado correctamente",
      userId: newUserId,
      token: token,
    });
  } catch (error) {
    try {
        await client.query("ROLLBACK");
    } catch (rbError) {
        console.error("Error durante el ROLLBACK:", rbError);
    }

    console.error("Error al registrar usuario:", error); 

    if (error.code === "23505") {
      if (error.detail && typeof error.detail === 'string' && error.detail.toLowerCase().includes('email')) {
        return res.status(409).json({ success: false, message: "El email ya está registrado." });
      }
      return res.status(409).json({ success: false, message: "Ya existe un registro con uno de los datos únicos proporcionados (ej. email)." });
    }
    
    if (error.message === "No se pudo crear el usuario en la tabla Usuarios.") {
        return res.status(500).json({ success: false, message: error.message });
    }
    
    res.status(500).json({ success: false, message: "Error interno del servidor al registrar el usuario." });
  } finally {
    client.release();
  }
};