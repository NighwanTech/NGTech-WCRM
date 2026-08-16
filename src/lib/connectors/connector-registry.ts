/**
 * AIWCRM Enterprise Operating System (EOS) — Connector Registry
 * Reusable connector abstraction for Meta, Website, Shopify, WooCommerce, Excel, Google Sheets, REST API, WhatsApp.
 */

export type ConnectorId =
  | 'meta'
  | 'website'
  | 'shopify'
  | 'woocommerce'
  | 'excel'
  | 'google-sheets'
  | 'rest-api'
  | 'whatsapp'

export interface ConnectorRegistration {
  id: ConnectorId
  name: string
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR'
  healthScore: number
  lastSync: string
  supportedEvents: string[]
}

export class ConnectorRegistry {
  private static registry: Map<ConnectorId, ConnectorRegistration> = new Map([
    ['meta', { id: 'meta', name: 'Meta Graph API & Leadgen Webhooks', status: 'ACTIVE', healthScore: 99, lastSync: '1 min ago', supportedEvents: ['LEAD_RECEIVED', 'LEAD_QUALIFIED'] }],
    ['website', { id: 'website', name: 'Website & Landing Page Forms', status: 'ACTIVE', healthScore: 100, lastSync: 'Realtime', supportedEvents: ['LEAD_RECEIVED'] }],
    ['whatsapp', { id: 'whatsapp', name: 'WhatsApp Cloud API', status: 'ACTIVE', healthScore: 98, lastSync: '2 mins ago', supportedEvents: ['MESSAGE_RECEIVED', 'LEAD_RECEIVED'] }],
    ['excel', { id: 'excel', name: 'Excel / CSV File Importer', status: 'ACTIVE', healthScore: 100, lastSync: 'On Demand', supportedEvents: ['BATCH_IMPORT'] }],
    ['google-sheets', { id: 'google-sheets', name: 'Google Sheets Realtime Sync', status: 'ACTIVE', healthScore: 96, lastSync: '5 mins ago', supportedEvents: ['ROW_INSERTED'] }],
    ['shopify', { id: 'shopify', name: 'Shopify / WooCommerce Store', status: 'ACTIVE', healthScore: 94, lastSync: '10 mins ago', supportedEvents: ['ORDER_CREATED'] }],
    ['rest-api', { id: 'rest-api', name: 'Universal Intake REST API', status: 'ACTIVE', healthScore: 100, lastSync: 'Realtime', supportedEvents: ['LEAD_RECEIVED'] }]
  ])

  public static getConnectors(): ConnectorRegistration[] {
    return Array.from(this.registry.values())
  }

  public static getConnector(id: ConnectorId): ConnectorRegistration | undefined {
    return this.registry.get(id)
  }
}
