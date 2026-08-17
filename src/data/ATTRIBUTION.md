# Atribución del modelo anatómico

`skeleton.glb` es una obra derivada. Estos son sus autores y su licencia.

## Licencia

**Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**
<https://creativecommons.org/licenses/by-sa/4.0/>

Espejar, renombrar, podar o recortar este archivo produce obra adaptada, y esa
obra hereda la misma licencia. La cláusula ShareAlike alcanza al modelo y a lo
que se derive de él; no alcanza al código de la aplicación que lo muestra.

## Cadena de autoría

| Obra | Autoría | Licencia |
|---|---|---|
| Modelo original | BodyParts3D, © The Database Center for Life Science | CC BY-SA 2.1 Japón |
| Atlas derivado | Z-Anatomy, Gauthier Kervyn | CC BY-SA 4.0 |
| Modelo publicado | Open 3D Model, AnatomyTOOL / CASK Anatomy — departamento de Anatomía, Leiden University Medical Center | CC BY-SA 4.0 |
| Este archivo | huesos-mono, derivado del anterior | CC BY-SA 4.0 |

Atribución exigida por BodyParts3D, en su forma literal:

> BodyParts3D, © The Database Center for Life Science licensed under
> CC Attribution-Share Alike 2.1 Japan

## Qué se le hizo al original

Se descargó de `caskanatomy.info/open3dviewer/3dmodels/overview-skeleton/` y se
le quitaron **132 imágenes y 133 texturas** —mapas de normales— con
`scripts/strip-textures.mjs`, que además reconstruye el buffer para que sus
bytes no queden dentro del archivo.

La poda no es cosmética ni una optimización de peso: **esas texturas son
CC BY-NC-SA**, basadas en «Thoracic walls» de Claudia Krebs et al. (University
of British Columbia), mientras el resto del modelo es CC BY-SA 4.0. Arrastrarlas
habría impuesto una cláusula no comercial sobre todo el producto. Ningún
material las usaba como color base, así que su ausencia solo cuesta relieve de
superficie.

De paso, el archivo pasó de 3,3 MB a 1,86 MB.

## Exactitud

Los autores del modelo declaran expresamente que no garantizan su exactitud
anatómica. huesos-mono lo adopta como está y no es autoridad anatómica.
