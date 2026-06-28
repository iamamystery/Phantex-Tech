import type { Article } from '../types'

import { buildingAiAgentsCustomerSupport } from './building-ai-agents-customer-support'
import { fastapiPatternsBackendTeams } from './fastapi-patterns-backend-teams'
import { scalingSeleniumWorkloads } from './scaling-selenium-workloads'
import { reducingManualReporting } from './reducing-manual-reporting-90-percent'
import { eventDrivenSystemsPython } from './event-driven-systems-python'
import { supabaseArchitectureSaas } from './supabase-architecture-saas'
import { automatingBrowserWorkflowsPlaywright } from './automating-browser-workflows-playwright'
import { databaseDesignHighGrowthStartups } from './database-design-high-growth-startups'
import { buildingProductionReadyRestApis } from './building-production-ready-rest-apis'
import { aiSystemsArchitecture } from './ai-systems-architecture'
import { scalingAutomationWorkflows } from './scaling-automation-workflows'
import { designingMaintainableApis } from './designing-maintainable-apis'
import { dataPipeline100kRecords } from './data-pipeline-100k-records'

// ─────────────────────────────────────────────────────────────────────────────
// Master article registry. To publish a new article: create a file in this
// directory exporting an `Article`, then add it to this list. Everything else
// (routes, sitemap, related/adjacent, category & tag pages) updates itself.
// ─────────────────────────────────────────────────────────────────────────────

export const ARTICLES: Article[] = [
  dataPipeline100kRecords,
  buildingAiAgentsCustomerSupport,
  fastapiPatternsBackendTeams,
  scalingSeleniumWorkloads,
  reducingManualReporting,
  eventDrivenSystemsPython,
  supabaseArchitectureSaas,
  automatingBrowserWorkflowsPlaywright,
  databaseDesignHighGrowthStartups,
  buildingProductionReadyRestApis,
  aiSystemsArchitecture,
  scalingAutomationWorkflows,
  designingMaintainableApis,
]
