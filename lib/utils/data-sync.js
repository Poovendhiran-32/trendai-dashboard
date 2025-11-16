export class DataSyncManager {
  constructor(intervalMs = 30000) {
    this.syncInterval = null
    this.syncCallbacks = new Map()
    this.intervalMs = intervalMs
  }

  // Register a sync callback for a specific data type
  registerSync(dataType, callback) {
    if (!this.syncCallbacks.has(dataType)) {
      this.syncCallbacks.set(dataType, [])
    }
    this.syncCallbacks.get(dataType).push(callback)
  }

  // Unregister a sync callback
  unregisterSync(dataType, callback) {
    const callbacks = this.syncCallbacks.get(dataType)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  // Start automatic synchronization
  startAutoSync() {
    if (this.syncInterval) return

    this.syncInterval = setInterval(async () => {
      console.log("[v0] Running automatic data sync...")

      for (const [dataType, callbacks] of this.syncCallbacks.entries()) {
        try {
          await Promise.all(callbacks.map((callback) => callback()))
          console.log(`[v0] Synced ${dataType} successfully`)
        } catch (error) {
          console.error(`[v0] Failed to sync ${dataType}:`, error)
        }
      }
    }, this.intervalMs)

    console.log(`[v0] Auto-sync started with ${this.intervalMs}ms interval`)
  }

  // Stop automatic synchronization
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
      console.log("[v0] Auto-sync stopped")
    }
  }

  // Manual sync for specific data type
  async syncDataType(dataType) {
    const callbacks = this.syncCallbacks.get(dataType)
    if (!callbacks) {
      console.warn(`[v0] No sync callbacks registered for ${dataType}`)
      return
    }

    try {
      await Promise.all(callbacks.map((callback) => callback()))
      console.log(`[v0] Manual sync completed for ${dataType}`)
    } catch (error) {
      console.error(`[v0] Manual sync failed for ${dataType}:`, error)
      throw error
    }
  }

  // Sync all registered data types
  async syncAll() {
    console.log("[v0] Starting manual sync for all data types...")

    const syncPromises = Array.from(this.syncCallbacks.entries()).map(async ([dataType, callbacks]) => {
      try {
        await Promise.all(callbacks.map((callback) => callback()))
        return { dataType, success: true }
      } catch (error) {
        console.error(`[v0] Failed to sync ${dataType}:`, error)
        return { dataType, success: false, error }
      }
    })

    const results = await Promise.all(syncPromises)
    const successful = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success).length

    console.log(`[v0] Manual sync completed: ${successful} successful, ${failed} failed`)

    return results
  }

  // Get sync status
  getSyncStatus() {
    return {
      isAutoSyncActive: this.syncInterval !== null,
      registeredDataTypes: Array.from(this.syncCallbacks.keys()),
      intervalMs: this.intervalMs,
    }
  }
}

// Global sync manager instance
export const dataSyncManager = new DataSyncManager()

// Auto-start sync when module loads (browser only)
if (typeof window !== "undefined") {
  dataSyncManager.startAutoSync()
}
