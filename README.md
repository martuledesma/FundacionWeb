# Fundación Construir Juntos

Sitio web de la Fundación Construir Juntos en Yerba Buena, Tucumán.

## Funcionalidades

- **Panel de administración**: Solo el administrador puede editar contenido.
- **Cards dinámicas**: Agregar, editar y eliminar cards con imágenes.
- **Eventos del calendario**: Gestionar eventos próximos.
- **Subida de imágenes**: Subir imágenes a Firebase Storage.

## Configuración de Firebase

1. Crea un proyecto en Firebase Console.
2. Copia las credenciales en `src/firebase/config.js`.
3. Crea un usuario administrador con email `martinaledesma2@gmail.com`.
4. Habilita Email/Password en Authentication.
5. Agrega `localhost` a Authorized domains.
6. Sube las reglas de Firestore y Storage desde los archivos `.rules`.

## Instalación

```bash
npm install
npm run dev
```

Abre en `http://localhost:5173`.

## Panel de admin

- URL: `http://localhost:5173/admin`
- Email: `martinaledesma2@gmail.com`
- Contraseña: la que asignaste en Firebase

## Reglas de seguridad

- Solo el admin puede escribir en Firestore y subir imágenes.
- Todos pueden leer el contenido público.