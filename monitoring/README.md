# Cypress + Prometheus + Grafana

Este proyecto usa Cypress, no Playwright. El flujo equivalente es:

1. Ejecutar pruebas y crear `results/results.json`:
   `node monitoring/run-tests.js`
2. Publicar métricas:
   `node monitoring/metrics-server.js`
3. Abrir `http://localhost:9464/metrics`.
4. Levantar Prometheus con `monitoring/prometheus.yml` como configuración.
5. Comprobar `http://localhost:9090/targets`: el job `cypress` debe estar `UP`.
6. En Grafana, agregar Prometheus con URL `http://localhost:9090`.
7. Importar `monitoring/grafana-dashboard.json` o el nuevo dashboard `monitoring/grafana-dashboard-qa-overview.json`.

## Ejecución local sin Docker

Si no vas a usar Docker, necesitas tener Prometheus instalado localmente y arrancarlo apuntando al exporter en `localhost:9464`.

```powershell
node monitoring/metrics-server.js
```

Luego arranca Prometheus con tu binario local usando [monitoring/prometheus.yml](monitoring/prometheus.yml) y después crea o edita la datasource de Grafana de tipo Prometheus apuntando a `http://localhost:9090`.
