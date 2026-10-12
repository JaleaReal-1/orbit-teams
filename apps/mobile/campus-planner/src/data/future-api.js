/** Future boundary only. UI consumes repository.load/save, never fetch directly.
 * Implement authentication, API transport, versioning and conflict handling before enabling sync.
 * No endpoint or network access is configured in the offline MVP.
 */
export class FutureApiRepository {
  async load() {
    throw new Error('Sincronización aún no habilitada.');
  }
  async save() {
    throw new Error('Sincronización aún no habilitada.');
  }
}
