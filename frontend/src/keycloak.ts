import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: 'http://localhost:8180',
  realm: 'orphanage',
  clientId: 'orphanage-app',
})

export default keycloak
