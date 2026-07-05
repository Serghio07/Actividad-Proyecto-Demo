# Cypress + Prometheus + Grafana

Este proyecto usa Cypress, no Playwright. El flujo equivalente es:

1. Ejecutar pruebas y crear `results/results.json`:
   `node monitoring/run-tests.js`
2. Publicar métricas:
   `node monitoring/metrics-server.js`
3. Abrir `http://localhost:9464/metrics`.
4. Usar `monitoring/prometheus.yml` como configuración de Prometheus (o copiar
   su `scrape_configs`) y reiniciarlo.
5. Comprobar `http://localhost:9090/targets`: el job `cypress` debe estar `UP`.
6. En Grafana, agregar Prometheus con URL `http://localhost:9090`.
7. Importar `monitoring/grafana-dashboard.json`.

Si Prometheus está en Docker, cambiar el target a
`host.docker.internal:9464`. Si Grafana está en Docker, su URL del datasource
debe ser `http://host.docker.internal:9090`.
