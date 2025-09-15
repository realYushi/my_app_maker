import type { Entity } from '@mini-ai-app-builder/shared-types'

// Domain type constants for type safety
export const DomainContext = {
  ECOMMERCE: 'ecommerce',
  USER_MANAGEMENT: 'user_management',
  ADMIN: 'admin',
  GENERIC: 'generic'
} as const

export type DomainContext = typeof DomainContext[keyof typeof DomainContext]

// Context interfaces
export interface ContextScore {
  domain: DomainContext
  score: number
  matchedEntities: string[]
}

export interface ContextDetectionResult {
  primaryContext: DomainContext
  contextScores: ContextScore[]
  entityDomainMap: Map<string, DomainContext>
}

class ContextDetectionService {
  // E-commerce entity patterns
  private readonly ECOMMERCE_PATTERNS = [
    'product', 'products', 'item', 'items', 'catalog', 'inventory',
    'order', 'orders', 'purchase', 'cart', 'basket',
    'customer', 'customers', 'buyer', 'client', 'shopper',
    'payment', 'billing', 'invoice', 'transaction', 'checkout',
    'shipping', 'delivery', 'warehouse', 'stock', 'sku',
    'category', 'categories', 'brand', 'vendor', 'supplier',
    'price', 'pricing', 'discount', 'coupon', 'promotion',
    'review', 'rating', 'feedback', 'wishlist', 'favorite'
  ]

  // User management entity patterns
  private readonly USER_MANAGEMENT_PATTERNS = [
    'user', 'users', 'account', 'accounts', 'member', 'members',
    'profile', 'profiles', 'person', 'people', 'contact',
    'role', 'roles', 'permission', 'permissions', 'access',
    'group', 'groups', 'team', 'teams', 'organization',
    'authentication', 'authorization', 'login', 'session',
    'credential', 'credentials', 'password', 'token',
    'right', 'rights'
  ]

  // Admin entity patterns
  private readonly ADMIN_PATTERNS = [
    'admin', 'administrator', 'management', 'configuration',
    'settings', 'config', 'system', 'log', 'logs', 'audit',
    'report', 'reports', 'analytics', 'dashboard', 'metric',
    'backup', 'maintenance', 'monitor', 'monitoring',
    'privilege', 'privileges'
  ]

  /**
   * Analyzes entities and categorizes them into domain contexts
   */
  detectContext(entities: Entity[]): ContextDetectionResult {
    const contextScores: ContextScore[] = [
      { domain: DomainContext.ECOMMERCE, score: 0, matchedEntities: [] },
      { domain: DomainContext.USER_MANAGEMENT, score: 0, matchedEntities: [] },
      { domain: DomainContext.ADMIN, score: 0, matchedEntities: [] },
      { domain: DomainContext.GENERIC, score: 0, matchedEntities: [] }
    ]

    const entityDomainMap = new Map<string, DomainContext>()

    // Analyze each entity
    for (const entity of entities) {
      const entityName = entity.name.toLowerCase()
      const entityAttributes = entity.attributes.map(attr => attr.toLowerCase())

      // Score against each domain - prioritize entity name over attributes
      const ecommerceScore = this.calculateDomainScore(entityName, entityAttributes, this.ECOMMERCE_PATTERNS)
      const userMgmtScore = this.calculateDomainScore(entityName, entityAttributes, this.USER_MANAGEMENT_PATTERNS)
      const adminScore = this.calculateDomainScore(entityName, entityAttributes, this.ADMIN_PATTERNS)

      // Determine primary domain for this entity
      let entityDomain: DomainContext = DomainContext.GENERIC
      let maxScore = 0

      if (ecommerceScore > maxScore) {
        maxScore = ecommerceScore
        entityDomain = DomainContext.ECOMMERCE
      }
      if (userMgmtScore > maxScore) {
        maxScore = userMgmtScore
        entityDomain = DomainContext.USER_MANAGEMENT
      }
      if (adminScore > maxScore) {
        maxScore = adminScore
        entityDomain = DomainContext.ADMIN
      }

      // Only assign to specific domain if score is significant (> 0)
      if (maxScore > 0) {
        entityDomainMap.set(entity.name, entityDomain)

        // Add to context scores
        const contextScore = contextScores.find(cs => cs.domain === entityDomain)
        if (contextScore) {
          contextScore.score += maxScore
          contextScore.matchedEntities.push(entity.name)
        }
      } else {
        entityDomainMap.set(entity.name, DomainContext.GENERIC)
        const genericScore = contextScores.find(cs => cs.domain === DomainContext.GENERIC)
        if (genericScore) {
          genericScore.score += 1
          genericScore.matchedEntities.push(entity.name)
        }
      }
    }

    // Determine primary context based on highest total score
    const primaryContext = this.determinePrimaryContext(contextScores)

    return {
      primaryContext,
      contextScores: contextScores.sort((a, b) => b.score - a.score),
      entityDomainMap
    }
  }

  /**
   * Calculates domain score for an entity based on pattern matching
   * Prioritizes entity name matches over attribute matches
   */
  private calculateDomainScore(entityName: string, entityAttributes: string[], patterns: string[]): number {
    let score = 0

    // Check entity name (higher weight)
    for (const pattern of patterns) {
      // Exact match gets highest score
      if (entityName === pattern) {
        score += 20
      }
      // Partial match gets medium score (but must be meaningful)
      else if (this.isMeaningfulMatch(entityName, pattern)) {
        score += 10
      }
    }

    // Check attributes (lower weight)
    for (const attribute of entityAttributes) {
      for (const pattern of patterns) {
        // Exact match gets medium score
        if (attribute === pattern) {
          score += 5
        }
        // Partial match gets low score (but must be meaningful)
        else if (this.isMeaningfulMatch(attribute, pattern)) {
          score += 2
        }
      }
    }

    return score
  }

  /**
   * Determines if a partial match is meaningful enough to count
   * Uses whitelist approach for known good partial matches
   */
  private isMeaningfulMatch(term: string, pattern: string): boolean {
    // Allow partial matches for known compound words and plurals
    const allowedPartialMatches: Record<string, string[]> = {
      // E-commerce patterns
      'products': ['product'],
      'orders': ['order'],
      'customers': ['customer'],
      'categories': ['category'],
      'items': ['item'],
      // User management patterns
      'users': ['user'],
      'accounts': ['account'],
      'members': ['member'],
      'profiles': ['profile'],
      'roles': ['role'],
      'permissions': ['permission'],
      'groups': ['group'],
      'teams': ['team'],
      'credentials': ['credential'],
      'privileges': ['privilege'],
      // Admin patterns
      'logs': ['log'],
      'reports': ['report'],
      'settings': ['setting'],
      'configs': ['config']
    }

    // Check if term contains pattern exactly (for plurals)
    if (allowedPartialMatches[term]?.includes(pattern)) {
      return true
    }
    if (allowedPartialMatches[pattern]?.includes(term)) {
      return true
    }

    // For other cases, only allow if one is a meaningful prefix/suffix of the other
    // and they share a semantic relationship
    const semanticPrefixes = ['user_', 'admin_', 'product_', 'order_', 'customer_']
    const semanticSuffixes = ['_id', '_name', '_type', '_status', '_date', '_time']

    for (const prefix of semanticPrefixes) {
      if (term.startsWith(prefix) && pattern === prefix.slice(0, -1)) {
        return true
      }
      if (pattern.startsWith(prefix) && term === prefix.slice(0, -1)) {
        return true
      }
    }

    for (const suffix of semanticSuffixes) {
      if (term.endsWith(suffix) && pattern === term.slice(0, -suffix.length)) {
        return true
      }
      if (pattern.endsWith(suffix) && term === pattern.slice(0, -suffix.length)) {
        return true
      }
    }

    return false
  }

  /**
   * Determines primary domain context based on context scores
   */
  private determinePrimaryContext(contextScores: ContextScore[]): DomainContext {
    // Find the context with the highest score
    const sortedScores = [...contextScores].sort((a, b) => b.score - a.score)

    // If no specific domain has a significant score, return generic
    if (sortedScores[0].score === 0) {
      return DomainContext.GENERIC
    }

    // If the top score is significantly higher than others, use it
    const topScore = sortedScores[0]
    const secondScore = sortedScores[1]

    // If there's a clear winner (50% more than second place), use it
    if (topScore.score >= secondScore.score * 1.5) {
      return topScore.domain
    }

    // If scores are close, prefer specific domains over generic
    if (topScore.domain !== DomainContext.GENERIC) {
      return topScore.domain
    }

    return secondScore.domain !== DomainContext.GENERIC ? secondScore.domain : DomainContext.GENERIC
  }

  /**
   * Gets the domain context for a specific entity
   */
  getEntityDomain(entityName: string, contextResult: ContextDetectionResult): DomainContext {
    return contextResult.entityDomainMap.get(entityName) || DomainContext.GENERIC
  }

  /**
   * Checks if the detected context is a specific domain (not generic)
   */
  hasSpecificContext(contextResult: ContextDetectionResult): boolean {
    return contextResult.primaryContext !== DomainContext.GENERIC
  }
}

export const contextDetectionService = new ContextDetectionService()