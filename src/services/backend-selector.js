// services/backend-selector.js
import { GoalsBackend } from './goals-backend'
import { OfflineBackend } from '../offline/offline-backend'

export default class BackendSelector {
  static get isOfflineMode() {
    const urlParams = new URLSearchParams(window.location.search)
    const offlineParam = urlParams.get('offline')
    // if it is specified like '?offline' - it is an empty string, if it is ommitted, it is null.
    // Both empty string and 'true' value are the reason to go to offline mode
    // if it is online mode but there is no userId - it is offline mode
    return offlineParam === '' || offlineParam === 'true' || !localStorage.getItem('userId')
  }
  static getBackend() {
    if (BackendSelector.isOfflineMode) {
      return OfflineBackend.getDefaultInstance()
    } else {
      return GoalsBackend.getDefaultInstance()
    }
  }
}
