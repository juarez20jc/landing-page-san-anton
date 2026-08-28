---
description: Sube todos los cambios a GitHub — commit y push a main — y comprueba que el despliegue en Pages salga bien
argument-hint: [mensaje del commit (opcional)]
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(git log:*), Bash(git branch:*), Bash(gh run list:*), Bash(gh run view:*)
---

Sube a GitHub todo lo que haya cambiado en el repositorio.

## Antes de nada

Mira qué hay pendiente y qué rama es:

- `git status --short`
- `git branch --show-current`
- `git diff --stat` y `git diff --cached --stat`

**Si no hay nada que subir**, dilo en una línea y para ahí. No hagas un commit vacío.

**Si la rama no es `main`**, avisa de a qué rama vas a empujar y sigue; no cambies de rama por tu cuenta.

## Qué revisar antes de hacer commit

Repasa el diff antes de añadir nada y **avisa al usuario, sin subirlo, si aparece**:

- credenciales, tokens, claves o `.env`
- archivos enormes o generados que deberían estar en `.gitignore` (`dist/`, `node_modules/`, la salida del lienzo `diseno/landing-*.html`)
- algo que claramente no toca en este commit

En esos casos pregunta antes de continuar.

## El commit

Añade todo lo que quede pendiente (`git add -A`) y haz **un solo commit**.

El mensaje va **en español**, en presente y sin punto final, describiendo *qué cambió y por qué*, no la lista de archivos:

- Si el usuario pasó argumentos, úsalos tal cual como asunto: **$ARGUMENTS**
- Si no, escríbelo tú a partir del diff. Asunto corto (menos de 72 caracteres) y, si hay varios cambios distintos, un cuerpo con dos o tres viñetas.

Cierra el mensaje con las líneas de coautoría y de sesión que use esta sesión de Claude Code.

## El push

`git push` a `origin`.

Si el push se rechaza porque el remoto va por delante, **no fuerces nada**: cuéntaselo al usuario y propón traer los cambios de arriba primero.

## Después de subir

Este repositorio publica en GitHub Pages con GitHub Actions: cada push a `main` relanza el despliegue de <https://juarez20jc.github.io/landing-page-san-anton/>.

Comprueba cómo va con `gh run list --limit 1`. Si sigue en marcha, dilo y no te quedes esperando; si falló, mira `gh run view --log-failed` y explica qué se rompió.

## Qué contarle al usuario

Tres o cuatro líneas, sin adornos:

- qué subiste, en una frase
- el asunto del commit y su hash corto
- si el despliegue arrancó, terminó bien o falló
- cualquier cosa que dejaras fuera a propósito, y por qué
