# Mapa de redirecciones

No se han creado redirecciones automáticas de slugs en esta fase porque no existe un registro fiable de slugs históricos en el repositorio. El sistema debe generar una tabla de alias antes de redirigir.

Regla propuesta para la migración segura:

1. conservar `Vehicle.id` como identidad;
2. guardar el slug anterior en una tabla de alias con `vehicleId`, `oldSlug`, `createdAt`;
3. responder 301 solo si el alias pertenece al vehículo activo;
4. responder 404 si el vehículo está despublicado y no existe una página equivalente;
5. no hacer coincidencias parciales por título.
